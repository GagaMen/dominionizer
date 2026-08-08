import { CardTranslation } from '../../../../../src/app/models/card';
import {
    CardPage,
    CardTypePage,
    CargoCard,
    CargoCardType,
    WikiText,
} from '../wiki-client/api-models';
import {
    TemplateArguments,
    extractSection,
    extractTemplateArguments,
    extractTemplates,
    normalize,
} from './helper-functions';
import { buildCargoId } from './cargo-id';

export class CardTranslationBuilder {
    build(
        page: CardPage | CardTypePage,
        cargoCard: CargoCard | CargoCardType,
    ): Map<string, CardTranslation> {
        const wikiText: WikiText = page.revisions[0].slots.main['*'] ?? '';
        const langVersions: WikiText[] = extractTemplates(
            wikiText.replace(/<!--.*?-->/gs, ''),
            'CardLangVersion',
        );

        return langVersions.length > 0
            ? this.buildFromLangVersions(langVersions, cargoCard)
            : this.buildFromTable(wikiText, cargoCard);
    }

    // The wiki is migrating its language tables from a hand-written wikitable to
    // {{CardLangVersion}} template calls, so both forms have to be understood.
    private buildFromLangVersions(
        langVersions: WikiText[],
        cargoCard: CargoCard | CargoCardType,
    ): Map<string, CardTranslation> {
        const langVersionsByLanguage = new Map<string, TemplateArguments[]>();

        for (const langVersion of langVersions) {
            const templateArguments = extractTemplateArguments(langVersion);
            const language = normalize(templateArguments.positional[0]);

            langVersionsByLanguage.set(
                language,
                (langVersionsByLanguage.get(language) ?? []).concat(templateArguments),
            );
        }

        const translations = new Map<string, CardTranslation>();

        for (const [language, langVersionsOfLanguage] of langVersionsByLanguage) {
            const { positional } = this.findLatestLangVersion(langVersionsOfLanguage);

            translations.set(language, {
                id: buildCargoId(cargoCard),
                name: this.normalizeCardName(positional[1]),
                description: this.normalizeCardDescription(positional[2]),
            });
        }

        return translations;
    }

    // The printings of a language are listed from oldest to newest, so the last one wins. Entries
    // added while migrating a page often carry no card text yet; in that case we fall back to the
    // newest entry that has one, because the text of an older printing beats no text at all.
    private findLatestLangVersion(langVersions: TemplateArguments[]): TemplateArguments {
        const langVersionsWithDescription = langVersions.filter(
            (langVersion) => normalize(langVersion.positional[2]) !== '',
        );

        return langVersionsWithDescription.at(-1) ?? langVersions[langVersions.length - 1];
    }

    private buildFromTable(
        wikiText: WikiText,
        cargoCard: CargoCard | CargoCardType,
    ): Map<string, CardTranslation> {
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
        // removes HTML attributes on cells
        name = /^.*(?<!\{\{.*?)\|(.*)/s.exec(name ?? '')?.[1] ?? '';

        return this.normalizeCardName(name);
    }

    private normalizeCardName(name: WikiText | undefined): string {
        const nameMatch = /^\s*(?:\{\{nowrap\|(.*?)\}\}|([^{(]*))/i.exec(name ?? '');
        name = nameMatch?.[1] ?? nameMatch?.[2] ?? '';
        name = name.replace(/(<br\s*\/?>|<hr[^>]*?>).*/, '');

        return normalize(name);
    }

    private extractCardDescription(description: WikiText | undefined): string {
        // removes HTML attributes on cells
        description = description?.replace(/^.*(?<!\{\{.*?)\|/s, '');

        return this.normalizeCardDescription(description);
    }

    private normalizeCardDescription(description: WikiText | undefined): string {
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
