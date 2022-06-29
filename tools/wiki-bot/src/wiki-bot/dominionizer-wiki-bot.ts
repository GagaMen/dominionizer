import { ExpansionTranslationBuilder } from './builder/expansion-translation-builder';
import { writeFile } from 'fs/promises';
import { Expansion, ExpansionTranslation } from './../../../../src/app/models/expansion';
import { ExpansionBuilder } from './builder/expansion-builder';
import { WikiClient } from './wiki-client/wiki-client';
import { ExpansionPage } from './wiki-client/api-models';

export class DominionizerWikiBot {
    constructor(
        private wikiClient: WikiClient,
        private expansionBuilder: ExpansionBuilder,
        private expansionTranslationBuilder: ExpansionTranslationBuilder,
    ) {}

    async generateAll(): Promise<void> {
        const expansionPages = await this.wikiClient.fetchAllExpansionPages();
        await this.generateExpansions(expansionPages);
        await this.generateExpansionTranslations(expansionPages);
    }

    private async generateExpansions(expansionPages: ExpansionPage[]): Promise<void> {
        let expansions: Expansion[] = [];

        for (const expansionPage of expansionPages) {
            expansions = expansions.concat(this.expansionBuilder.build(expansionPage));
        }

        await writeFile('expansions.json', JSON.stringify(expansions));
    }

    private async generateExpansionTranslations(expansionPages: ExpansionPage[]): Promise<void> {
        const translations: Map<string, ExpansionTranslation[]> = new Map();

        for (const expansionPage of expansionPages) {
            const translationsByExpansion = this.expansionTranslationBuilder.build(expansionPage);

            for (const [language, translation] of translationsByExpansion) {
                const translationsByLanguage = translations.get(language) ?? [];

                translations.set(language, translationsByLanguage.concat(translation));
            }
        }

        for (const [language, translationsByLanguage] of translations) {
            await writeFile(
                `expansions.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }
    }
}
