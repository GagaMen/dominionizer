import { CardTranslation } from '../../../../../src/app/models/card';
import {
    CardPage,
    CardTypePage,
    CargoCard,
    CargoCardType,
    WikiText,
} from '../wiki-client/api-models';
import { extractSection, normalize } from './helper-functions';
import { buildCargoId } from './cargo-id';

export class CardTranslationBuilder {
    build(
        page: CardPage | CardTypePage,
        cargoCard: CargoCard | CargoCardType,
    ): Map<string, CardTranslation> {
        const wikiText: WikiText = page.revisions[0].slots.main['*'] ?? '';
        const otherLanguageVersions: WikiText = extractSection(
            wikiText,
            '(?:In other languages|Other language versions)',
            3,
        );

        const table = /\n\s*{\|(.*?\n)\s*\|}/s.exec(otherLanguageVersions)?.[1] ?? '';
        const textColumnIndex = this.findTextColumnIndex(table);
        // remove html comments and table header
        const tableBody = table.replace(/<!--.*?-->/gs, '').substring(table.indexOf('|-'));

        const translations = new Map<string, CardTranslation>();

        const rowRegex = /![^!]*/g;
        let languageVersion: RegExpExecArray | null;
        while ((languageVersion = rowRegex.exec(tableBody))) {
            const language = /!\s*(?:rowspan="?\d"?\s*\|)?([^|\\]*)/.exec(languageVersion[0])?.[1];

            const latestTranslationVersion = this.findLatestTranslationVersion(languageVersion[0]);

            const cardName = this.extractCardName(latestTranslationVersion.at(0));
            // textColumnIndex - 1, because split with '||' returns the first two columns combined
            // in the first array element
            const cardDescription = this.extractCardDescription(
                latestTranslationVersion.at(textColumnIndex - 1),
            );

            translations.set(normalize(language), {
                id: buildCargoId(cargoCard),
                name: cardName,
                description: cardDescription,
            });
        }

        return translations;
    }

    private findTextColumnIndex(table: WikiText): number {
        const tableHeader = /\n\s*!(.*?)\n/.exec(table)?.[1] ?? '';
        return tableHeader
            .split('!!')
            .findIndex((columnLabel) => normalize(columnLabel).includes('Text'));
    }

    private findLatestTranslationVersion(languageVersion: WikiText): WikiText[] {
        const translationVersions: WikiText[][] = languageVersion
            .split(/\s*\|-\s*\n/)
            .filter((entry) => entry !== '')
            .map((translationVersion: WikiText) => translationVersion?.split('||') ?? []);

        // we ensure that the latest translation version contains columns that span multiple rows
        const firstTranslationVersion = translationVersions.at(0);
        let latestTranslationVersion = translationVersions.at(-1);
        const diff =
            (firstTranslationVersion?.length ?? 0) - (latestTranslationVersion?.length ?? 0);
        if (diff > 0) {
            const missingColumns = firstTranslationVersion?.slice(0, diff);
            latestTranslationVersion = missingColumns?.concat(latestTranslationVersion ?? []);
        }

        return latestTranslationVersion ?? [];
    }

    private extractCardName(name: WikiText | undefined): string {
        name = /^.*(?<!\{\{.*?)\|(.*)/s.exec(name ?? '')?.[1] ?? '';
        const nameMatch = /^\s*(?:\{\{nowrap\|(.*?)\}\}|([^{(]*))/i.exec(name ?? '');
        name = nameMatch?.[1] ?? nameMatch?.[2] ?? '';
        name = name.replace(/(<br\s*\/?>|<hr[^>]*?>).*/, '');

        return normalize(name);
    }

    private extractCardDescription(description: WikiText | undefined): string {
        // removes HTML attributes on cells
        description = description?.replace(/^.*(?<!\{\{.*?)\|/s, '');

        if (!description || !normalize(description)) {
            return '';
        }

        description = description
            .replace(/\n$/, '')
            .replace(/<br\s*\/?>/gi, '<br>')
            .replace(/<hr[^>]*?>/gi, '{{divline}}');

        return normalize(description);
    }
}
