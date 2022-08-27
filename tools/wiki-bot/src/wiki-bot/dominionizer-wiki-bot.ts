import { CardTypeTranslationBuilder } from './builder/card-type-translation-builder';
import { CardTypeBuilder } from './builder/card-type-builder';
import { EncodedImage, ImageBuilder } from './builder/image-builder';
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
import { ExpansionPage, CardPage, ImagePage, CardTypePage } from './wiki-client/api-models';
import { CardType, CardTypeTranslation } from 'src/app/models/card-type';
import { mkdir } from 'fs/promises';

export class DominionizerWikiBot {
    constructor(
        private targetPath: string,
        private wikiClient: WikiClient,
        private expansionBuilder: ExpansionBuilder,
        private expansionTranslationBuilder: ExpansionTranslationBuilder,
        private cardTypeBuilder: CardTypeBuilder,
        private cardTypeTranslationBuilder: CardTypeTranslationBuilder,
        private expansionCardsMapBuilder: ExpansionCardsMapBuilder,
        private cardDtoBuilder: CardDtoBuilder,
        private cardTranslationBuilder: CardTranslationBuilder,
        private imageBuilder: ImageBuilder,
    ) {}

    async generateAll(): Promise<void> {
        console.log('\nFetching expansion pages...');
        const expansionPages = await this.wikiClient.fetchAllExpansionPages();
        console.log(`${expansionPages.length} expansion pages fetched.\n`);

        console.log('Generating expansions...');
        const expansions = await this.generateExpansions(expansionPages);
        console.log(`${expansions.length} expansions generated.\n`);

        console.log('Generating expansion translations...');
        const expansionTranslations = await this.generateExpansionTranslations(expansionPages);
        console.log(
            `Expansion translations generated for ${expansionTranslations.size} languages.\n`,
        );

        console.log('\nFetching card type pages...');
        const cardTypePages = await this.wikiClient.fetchAllCardTypePages();
        console.log(`${cardTypePages.length} card type pages fetched.\n`);

        console.log('Generating card types...');
        const cardTypes = await this.generateCardTypes(cardTypePages);
        console.log(`${cardTypes.length} card types generated.\n`);

        console.log('Generating card types translations...');
        const cardTypeTranslations = await this.generateCardTypeTranslations(cardTypePages);
        console.log(
            `Card type translations generated for ${cardTypeTranslations.size} languages.\n`,
        );

        const cardExpansionsMap = this.generateCardExpansionsMap(expansionPages, cardTypePages);
        console.log('Fetching card pages...');
        const cardPages = await this.wikiClient.fetchAllCardPages();
        console.log(`${cardPages.length} card pages fetched.\n`);

        console.log('Generating cards...');
        const cards = await this.generateCards(
            cardPages,
            cardTypePages,
            cardExpansionsMap,
            cardTypes,
        );
        console.log(`${cards.length} cards generated.\n`);

        console.log('Generating card translations...');
        const cardTranslations = await this.generateCardTranslations(cardPages, cards);
        console.log(`Card translations generated for ${cardTranslations.size} languages.\n`);

        console.log('Fetching card symbol pages...');
        const cardSymbolPages = await this.wikiClient.fetchAllCardSymbolPages();
        console.log(`${cardSymbolPages.length} card symbol pages fetched.\n`);

        console.log('Generating card symbols...');
        const cardSymbols = await this.generateImages(cardSymbolPages, 'card_symbols');
        console.log(`${cardSymbols.length} card symbols generated.\n`);

        console.log('Fetching card art pages...');
        const cardArtPages = await this.wikiClient.fetchAllCardArtPages();
        console.log(`${cardArtPages.length} card art pages fetched.\n`);

        console.log('Generating card arts...');
        const cardArts = await this.generateImages(cardArtPages, 'card_arts');
        console.log(`${cardArts.length} card arts generated.\n`);
    }

    private async generateExpansions(expansionPages: ExpansionPage[]): Promise<Expansion[]> {
        let expansions: Expansion[] = [];

        for (const expansionPage of expansionPages) {
            expansions = expansions.concat(this.expansionBuilder.build(expansionPage));
        }

        this.sortById(expansions);

        await writeFile(`${this.targetPath}/data/expansions.json`, JSON.stringify(expansions));

        return expansions;
    }

    private async generateExpansionTranslations(
        expansionPages: ExpansionPage[],
    ): Promise<Map<string, ExpansionTranslation[]>> {
        const translations: Map<string, ExpansionTranslation[]> = new Map();

        for (const expansionPage of expansionPages) {
            const translationsByExpansion = this.expansionTranslationBuilder.build(expansionPage);

            for (const [language, translation] of translationsByExpansion) {
                const translationsByLanguage = translations.get(language) ?? [];

                translations.set(language, translationsByLanguage.concat(translation));
            }
        }

        for (const [language, translationsByLanguage] of translations) {
            this.sortById(translationsByLanguage);

            await writeFile(
                `${this.targetPath}/data/expansions.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }

        return translations;
    }

    private async generateCardTypes(cardTypePages: CardTypePage[]): Promise<CardType[]> {
        let cardTypes: CardType[] = [];

        for (const cardTypePage of cardTypePages) {
            cardTypes = cardTypes.concat(this.cardTypeBuilder.build(cardTypePage));
        }

        this.sortById(cardTypes);

        await writeFile(`${this.targetPath}/data/card-types.json`, JSON.stringify(cardTypes));

        return cardTypes;
    }

    private async generateCardTypeTranslations(
        cardTypePages: CardTypePage[],
    ): Promise<Map<string, CardTypeTranslation[]>> {
        const translations: Map<string, CardTypeTranslation[]> = new Map();

        for (const cardTypePage of cardTypePages) {
            const translationsByCardType = this.cardTypeTranslationBuilder.build(cardTypePage);

            for (const [language, translation] of translationsByCardType) {
                const translationsByLanguage = translations.get(language) ?? [];

                translations.set(language, translationsByLanguage.concat(translation));
            }
        }

        for (const [language, translationsByLanguage] of translations) {
            this.sortById(translationsByLanguage);

            await writeFile(
                `${this.targetPath}/data/card-types.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }

        return translations;
    }

    private generateCardExpansionsMap(
        expansionPages: ExpansionPage[],
        cardTypePages: CardTypePage[],
    ): Map<string, number[]> {
        let expansionCardsMap: Map<number, string[]> = new Map();
        const cardExpansionsMap: Map<string, number[]> = new Map();

        for (const expansionPage of expansionPages) {
            const map = this.expansionCardsMapBuilder.buildWithExpansionPage(expansionPage);
            expansionCardsMap = new Map([
                ...Array.from(expansionCardsMap.entries()),
                ...Array.from(map.entries()),
            ]);

            for (const [expansion, cardNames] of map) {
                for (const cardName of cardNames) {
                    const expansionsByCardName = cardExpansionsMap.get(cardName) ?? [];

                    cardExpansionsMap.set(cardName, expansionsByCardName.concat(expansion));
                }
            }
        }

        for (const cardTypePage of cardTypePages) {
            const map = this.expansionCardsMapBuilder.buildWithCardTypePage(
                cardTypePage,
                expansionCardsMap,
            );

            for (const [expansion, cardNames] of map) {
                for (const cardName of cardNames) {
                    const expansionsByCardName = cardExpansionsMap.get(cardName) ?? [];

                    // use Set to remove duplicate values
                    cardExpansionsMap.set(
                        cardName,
                        Array.from(new Set(expansionsByCardName.concat(expansion))),
                    );
                }
            }
        }

        return cardExpansionsMap;
    }

    private async generateCards(
        cardPages: CardPage[],
        cardTypePages: CardTypePage[],
        cardExpansionsMap: Map<string, number[]>,
        cardTypes: CardType[],
    ): Promise<CardDto[]> {
        let cards: CardDto[] = [];

        for (const cardPage of cardPages) {
            const card = this.cardDtoBuilder.build(cardPage, cardExpansionsMap, cardTypes);

            if (card === null) {
                continue;
            }

            cards = cards.concat(card);
        }

        for (const cardTypePage of cardTypePages) {
            const card = this.cardDtoBuilder.build(cardTypePage, cardExpansionsMap, cardTypes);

            if (
                card === null ||
                cards.some((existingCard: CardDto) => existingCard.id === card.id)
            ) {
                continue;
            }

            cards = cards.concat(card);
        }

        this.sortById(cards);

        await writeFile(`${this.targetPath}/data/cards.json`, JSON.stringify(cards));

        return cards;
    }

    private async generateCardTranslations(
        cardPages: CardPage[],
        cards: CardDto[],
    ): Promise<Map<string, CardTranslation[]>> {
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
            this.sortById(translationsByLanguage);

            await writeFile(
                `${this.targetPath}/data/cards.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }

        return translations;
    }

    private sortById(entities: { id: number }[]): void {
        entities.sort((first, second) => first.id - second.id);
    }

    private async generateImages(
        imagePages: ImagePage[],
        subFolder: string,
    ): Promise<EncodedImage[]> {
        const images: EncodedImage[] = [];

        await mkdir(`${this.targetPath}/${subFolder}`, { recursive: true });

        for (const imagePage of imagePages) {
            const encodedImage = await this.imageBuilder.build(imagePage);
            images.push(encodedImage);

            await writeFile(
                `${this.targetPath}/${subFolder}/${encodedImage.fileName}`,
                encodedImage.data,
            );
        }

        return images;
    }
}
