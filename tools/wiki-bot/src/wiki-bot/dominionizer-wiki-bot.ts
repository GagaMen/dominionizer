import { ImageBuilder } from './builder/image-builder';
import { CardTranslationBuilder } from './builder/card-translation-builder';
import { CardTranslation } from './../../../../src/app/models/card';
import { ExpansionCardsMapBuilder } from './builder/expansion-cards-map-builder';
import { CardDto } from './../../../../src/app/dtos/card-dto';
import { CardDtoBuilder } from './builder/card-dto-builder';
import { ExpansionTranslationBuilder } from './builder/expansion-translation-builder';
import { writeFile } from 'fs/promises';
import { Expansion, ExpansionTranslation } from './../../../../src/app/models/expansion';
import { ExpansionBuilder } from './builder/expansion-builder';
import { WikiClient } from './wiki-client/wiki-client';
import { ExpansionPage, CardPage, ImagePage } from './wiki-client/api-models';

export class DominionizerWikiBot {
    constructor(
        private targetPath: string,
        private wikiClient: WikiClient,
        private expansionBuilder: ExpansionBuilder,
        private expansionTranslationBuilder: ExpansionTranslationBuilder,
        private expansionCardsMapBuilder: ExpansionCardsMapBuilder,
        private cardDtoBuilder: CardDtoBuilder,
        private cardTranslationBuilder: CardTranslationBuilder,
        private imageBuilder: ImageBuilder,
    ) {}

    async generateAll(): Promise<void> {
        console.log('\nFetching expansion pages...');
        const expansionPages = await this.wikiClient.fetchAllExpansionPages();
        console.log('Expansion pages fetched.\n');

        console.log('Generating expansions...');
        await this.generateExpansions(expansionPages);
        console.log('Expansions generated.\n');

        console.log('Generating expansion translations...');
        await this.generateExpansionTranslations(expansionPages);
        console.log('Expansion translations generated.\n');

        const cardExpansionsMap = this.generateCardExpansionsMap(expansionPages);
        console.log('Fetching card pages...');
        const cardPages = await this.wikiClient.fetchAllCardPages();
        console.log('Card pages fetched.\n');

        console.log('Generating cards...');
        const cards = await this.generateCards(cardPages, cardExpansionsMap);
        console.log('Cards generated.\n');

        console.log('Generating card translations...');
        await this.generateCardTranslations(cardPages, cards);
        console.log('Card translations generated.\n');

        console.log('Fetching card symbol pages...');
        const cardSymbolPages = await this.wikiClient.fetchAllCardSymbolPages();
        console.log('Card symbol pages fetched.\n');

        console.log('Generating card symbols...');
        await this.generateImages(cardSymbolPages, 'card_symbols');
        console.log('Card symbols generated.\n');

        console.log('Fetching card art pages...');
        const cardArtPages = await this.wikiClient.fetchAllCardArtPages();
        console.log('Card art pages fetched.\n');

        console.log('Generating card arts...');
        await this.generateImages(cardArtPages, 'card_arts');
        console.log('Card arts generated.\n');
    }

    private async generateExpansions(expansionPages: ExpansionPage[]): Promise<void> {
        let expansions: Expansion[] = [];

        for (const expansionPage of expansionPages) {
            expansions = expansions.concat(this.expansionBuilder.build(expansionPage));
        }

        await writeFile(`${this.targetPath}/data/expansions.json`, JSON.stringify(expansions));
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
                `${this.targetPath}/data/expansions.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }
    }

    private generateCardExpansionsMap(expansionPages: ExpansionPage[]): Map<string, number[]> {
        const cardExpansionsMap: Map<string, number[]> = new Map();

        for (const expansionPage of expansionPages) {
            const expansionCardsMap = this.expansionCardsMapBuilder.build(expansionPage);

            for (const [expansion, cardNames] of expansionCardsMap) {
                for (const cardName of cardNames) {
                    const expansionsByCardName = cardExpansionsMap.get(cardName) ?? [];

                    cardExpansionsMap.set(cardName, expansionsByCardName.concat(expansion));
                }
            }
        }

        return cardExpansionsMap;
    }

    private async generateCards(
        cardPages: CardPage[],
        cardExpansionsMap: Map<string, number[]>,
    ): Promise<CardDto[]> {
        let cards: CardDto[] = [];

        for (const cardPage of cardPages) {
            cards = cards.concat(this.cardDtoBuilder.build(cardPage, cardExpansionsMap));
        }

        await writeFile(`${this.targetPath}/data/cards.json`, JSON.stringify(cards));

        return cards;
    }

    private async generateCardTranslations(cardPages: CardPage[], cards: CardDto[]): Promise<void> {
        const translations: Map<string, CardTranslation[]> = new Map();

        for (const cardPage of cardPages) {
            const card = cards.find((card: CardDto) => card.id === cardPage.pageid);
            if (card === undefined) continue;
            const translationsByCard = this.cardTranslationBuilder.build(cardPage, card);

            for (const [language, translation] of translationsByCard) {
                const translationsByLanguage = translations.get(language) ?? [];

                translations.set(language, translationsByLanguage.concat(translation));
            }
        }

        for (const [language, translationsByLanguage] of translations) {
            await writeFile(
                `${this.targetPath}/data/cards.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }
    }

    private async generateImages(imagePages: ImagePage[], subFolder: string): Promise<void> {
        for (const imagePage of imagePages) {
            const encodedImage = await this.imageBuilder.build(imagePage);

            await writeFile(
                `${this.targetPath}/${subFolder}/${encodedImage.fileName}`,
                encodedImage.data,
            );
        }
    }
}
