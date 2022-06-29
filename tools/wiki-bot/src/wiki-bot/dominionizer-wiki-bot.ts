import { ExpansionTranslationBuilder } from './builder/expansion-translation-builder';
import { writeFile } from 'fs/promises';
import { Expansion, ExpansionTranslation } from './../../../../src/app/models/expansion';
import { ExpansionBuilder } from './builder/expansion-builder';
import { WikiClient } from './wiki-client/wiki-client';

export class DominionizerWikiBot {
    constructor(
        private wikiClient: WikiClient,
        private expansionBuilder: ExpansionBuilder,
        private expansionTranslationBuilder: ExpansionTranslationBuilder,
    ) {}

    async generateAll(): Promise<void> {
        const expansionPages = await this.wikiClient.fetchAllExpansionPages();

        let expansions: Expansion[] = [];
        const expansionTranslations: Map<string, ExpansionTranslation[]> = new Map();

        for (const expansionPage of expansionPages) {
            expansions = expansions.concat(this.expansionBuilder.build(expansionPage));

            const translations = this.expansionTranslationBuilder.build(expansionPage);
            for (const [language, translation] of translations) {
                const translationsByLanguage = expansionTranslations.get(language) ?? [];

                expansionTranslations.set(language, translationsByLanguage.concat(translation));
            }
        }

        await writeFile('expansions.json', JSON.stringify(expansions));

        for (const [language, translations] of expansionTranslations) {
            await writeFile(
                `expansions.${language.toLowerCase()}.json`,
                JSON.stringify(translations),
            );
        }
    }
}
