import { CardTranslation } from '../../../../../src/app/models/card';
import { CardPage, WikiText } from '../wiki-client/api-models';
import { extractSection, normalize } from './helper-functions';

export class CardTranslationBuilder {
    build(cardPage: CardPage): Map<string, CardTranslation> {
        const wikiText: WikiText = cardPage.revisions[0]['*'] ?? '';
        const otherLanguageVersions: WikiText = extractSection(
            wikiText,
            'Other language versions',
            3,
        );

        const table = /\n\s*{\|(.*?\n)\s*\|}/s.exec(otherLanguageVersions)?.[1] ?? '';
        const textColumnIndex = this.findTextColumnIndex(table);
        // remove table header and html comments
        const tableBody = table.substr(table.indexOf('|-')).replace(/<!--.*?-->/g, '');

        const translations: Map<string, CardTranslation> = new Map();

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
                id: cardPage.pageid,
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
        const translationVersions: Array<WikiText[]> = languageVersion
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
        name = /^\s*(\{\{nowrap\|.*?\}\}|[^{(]*)/.exec(name)?.[1] ?? '';
        name = name.replace(/(<br>|<hr>).*/, '');

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
            .replace(/<br\/>/gi, '<br>')
            .replace(/<hr.*?>/gi, '{{divline}}');

        return normalize(description);
    }
}
