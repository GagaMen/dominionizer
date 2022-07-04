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
        private wikiClient: WikiClient,
        private expansionBuilder: ExpansionBuilder,
        private expansionTranslationBuilder: ExpansionTranslationBuilder,
        private expansionCardsMapBuilder: ExpansionCardsMapBuilder,
        private cardDtoBuilder: CardDtoBuilder,
        private cardTranslationBuilder: CardTranslationBuilder,
        private imageBuilder: ImageBuilder,
    ) {}

    async generateAll(): Promise<void> {
        const expansionPages = await this.wikiClient.fetchAllExpansionPages();
        await this.generateExpansions(expansionPages);
        await this.generateExpansionTranslations(expansionPages);

        const cardExpansionsMap = this.generateCardExpansionsMap(expansionPages);
        const cardPages = await this.wikiClient.fetchAllCardPages();
        const cards = await this.generateCards(cardPages, cardExpansionsMap);
        await this.generateCardTranslations(cardPages, cards);

        const cardSymbolPages = await this.wikiClient.fetchAllCardSymbolPages();
        await this.generateImages(cardSymbolPages);

        const cardArtPages = await this.wikiClient.fetchAllCardArtPages();
        await this.generateImages(cardArtPages);
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

        await writeFile('cards.json', JSON.stringify(cards));

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
                `cards.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }
    }

    private async generateImages(imagePages: ImagePage[]): Promise<void> {
        for (const imagePage of imagePages) {
            const encodedImage = await this.imageBuilder.build(imagePage);

            await writeFile(encodedImage.fileName, encodedImage.data);
        }
    }
}
