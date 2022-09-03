import { ImagesValidator } from './validation/image-validators';
import { CardTranslationValidator } from './validation/card-translation-validators';
import { CardDtosValidator, CardDtoValidator } from './validation/card-dto-validators';
import { CardTypeTranslationValidator } from './validation/card-type-translation-validators';
import { ExpansionTranslationValidator } from './validation/expansion-translation-validators';
import { ExpansionsValidator, ExpansionValidator } from './validation/expansion-validators';
import { CardTypesValidator, CardTypeValidator } from './validation/card-type-validators';
import { CardTypeTranslationBuilder } from './builder/card-type-translation-builder';
import { CardTypeBuilder } from './builder/card-type-builder';
import { EncodedImage, ImageBuilder } from './builder/image-builder';
import { CardTranslationBuilder } from './builder/card-translation-builder';
import { CardTranslation } from './../../../../src/app/models/card';
import { ExpansionCardsMapBuilder } from './builder/expansion-cards-map-builder';
import { CardDto } from './../../../../src/app/dtos/card-dto';
import { CardDtoBuilder } from './builder/card-dto-builder';
import { ExpansionTranslationBuilder } from './builder/expansion-translation-builder';
import { readFile, writeFile } from 'fs/promises';
import { Expansion, ExpansionTranslation } from './../../../../src/app/models/expansion';
import { ExpansionBuilder } from './builder/expansion-builder';
import { WikiClient } from './wiki-client/wiki-client';
import {
    ExpansionPage,
    CardPage,
    ImagePage,
    CardTypePage,
    ChangedPage,
} from './wiki-client/api-models';
import { CardType, CardTypeTranslation } from 'src/app/models/card-type';
import { mkdir } from 'fs/promises';
import { ValidationResult } from './validation/validation-result';
import { red } from 'chalk';

export class DominionizerWikiBot {
    private successful = true;

    constructor(
        private currentGenerationTime: Date,
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
        private expansionValidator: ExpansionValidator,
        private expansionsValidator: ExpansionsValidator,
        private expansionTranslationValidator: ExpansionTranslationValidator,
        private cardTypeValidator: CardTypeValidator,
        private cardTypesValidator: CardTypesValidator,
        private cardTypeTranslationValidator: CardTypeTranslationValidator,
        private cardDtoValidator: CardDtoValidator,
        private cardDtosValidator: CardDtosValidator,
        private cardTranslationValidator: CardTranslationValidator,
        private imageValidator: ImagesValidator,
    ) {}

    async generateAll(skipImages: boolean = false): Promise<boolean> {
        await this.writeCurrentGenerationTime();

        const expansionPages = await this.wikiClient.fetchAllExpansionPages();
        const expansions = this.generateExpansions(expansionPages);
        await this.writeExpansions(expansions);
        const expansionTranslations = this.generateExpansionTranslations(expansionPages);
        await this.writeExpansionTranslations(expansionTranslations);

        const cardTypePages = await this.wikiClient.fetchAllCardTypePages();
        const cardTypes = this.generateCardTypes(cardTypePages);
        await this.writeCardTypes(cardTypes);
        const cardTypeTranslations = this.generateCardTypeTranslations(cardTypePages);
        await this.writeCardTypeTranslations(cardTypeTranslations);

        const cardExpansionsMap = this.generateCardExpansionsMap(expansionPages, cardTypePages);
        const cardPages = await this.wikiClient.fetchAllCardPages();
        const cards = this.generateCards(cardPages, cardTypePages, cardExpansionsMap, cardTypes);
        await this.writeCards(cards);
        const cardTranslations = this.generateCardTranslations(cardPages);
        await this.writeCardTranslations(cardTranslations);

        if (skipImages) {
            return this.successful;
        }

        const cardSymbolPages = await this.wikiClient.fetchAllCardSymbolPages();
        await this.generateImages(cardSymbolPages, 'card_symbols');

        const cardArtPages = await this.wikiClient.fetchAllCardArtPages();
        await this.generateImages(cardArtPages, 'card_arts');

        return this.successful;
    }

    async generateUpdate(): Promise<boolean> {
        const lastGenerationTime = await this.readLastGenerationTime();
        await this.writeCurrentGenerationTime();

        const changedPages = await this.wikiClient.fetchRecentChanges(
            lastGenerationTime.toISOString(),
        );

        const pageIds = changedPages.map((changedPage: ChangedPage) => changedPage.pageid);
        const changedExpansionPages = await this.wikiClient.fetchMultipleExpansionPages(pageIds);
        const changedExpansions = this.generateExpansions(changedExpansionPages);

        const expansions = await this.readExpansions();

        for (const changedExpansion of changedExpansions) {
            const index = expansions.findIndex(
                (oldExpansion: Expansion) => oldExpansion.id === changedExpansion.id,
            );

            if (index >= 0) {
                expansions[index] = changedExpansion;
                continue;
            }

            expansions.push(changedExpansion);
        }

        await this.writeExpansions(expansions);

        return this.successful;
    }

    private async readLastGenerationTime(): Promise<Date> {
        const lastGenerationTimeJsonString = await readFile('./last-generation.json', 'utf8');

        return new Date(JSON.parse(lastGenerationTimeJsonString));
    }

    private async writeCurrentGenerationTime(): Promise<void> {
        await writeFile('./last-generation.json', JSON.stringify(this.currentGenerationTime));
    }

    private generateExpansions(expansionPages: ExpansionPage[]): Expansion[] {
        console.log('Generating expansions...');

        let expansions: Expansion[] = [];

        for (const expansionPage of expansionPages) {
            const generatedExpansions = this.expansionBuilder.build(expansionPage);

            generatedExpansions.forEach((expansion) => {
                this.evaluateValidationResult(
                    this.expansionValidator.validate(expansion, expansionPage),
                );
            });

            expansions = expansions.concat(this.expansionBuilder.build(expansionPage));
        }

        this.sortById(expansions);

        this.evaluateValidationResult(
            this.expansionsValidator.validate(expansions, expansionPages),
        );

        return expansions;
    }

    private async readExpansions(): Promise<Expansion[]> {
        return JSON.parse(
            await readFile(`${this.targetPath}/data/expansions.json`, 'utf8'),
        ) as Expansion[];
    }

    private async writeExpansions(expansions: Expansion[]): Promise<void> {
        await writeFile(`${this.targetPath}/data/expansions.json`, JSON.stringify(expansions));
    }

    private generateExpansionTranslations(
        expansionPages: ExpansionPage[],
    ): Map<string, ExpansionTranslation[]> {
        console.log('Generating expansion translations...');

        const translations: Map<string, ExpansionTranslation[]> = new Map();

        for (const expansionPage of expansionPages) {
            const translationsByExpansion = this.expansionTranslationBuilder.build(expansionPage);

            for (const [language, translation] of translationsByExpansion) {
                const translationsByLanguage = translations.get(language) ?? [];

                this.evaluateValidationResult(
                    this.expansionTranslationValidator.validate(
                        translation,
                        language,
                        expansionPage,
                    ),
                );

                translations.set(language, translationsByLanguage.concat(translation));
            }
        }

        for (const [_, translationsByLanguage] of translations) {
            this.sortById(translationsByLanguage);
        }

        return translations;
    }

    private async writeExpansionTranslations(
        expansionTranslations: Map<string, ExpansionTranslation[]>,
    ): Promise<void> {
        for (const [language, translationsByLanguage] of expansionTranslations) {
            await writeFile(
                `${this.targetPath}/data/expansions.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }
    }

    private generateCardTypes(cardTypePages: CardTypePage[]): CardType[] {
        console.log('Generating card types...');

        let cardTypes: CardType[] = [];

        for (const cardTypePage of cardTypePages) {
            const cardType = this.cardTypeBuilder.build(cardTypePage);
            this.evaluateValidationResult(this.cardTypeValidator.validate(cardType, cardTypePage));

            cardTypes = cardTypes.concat(cardType);
        }

        this.sortById(cardTypes);

        this.evaluateValidationResult(this.cardTypesValidator.validate(cardTypes, cardTypePages));

        return cardTypes;
    }

    private async writeCardTypes(cardTypes: CardType[]): Promise<void> {
        await writeFile(`${this.targetPath}/data/card-types.json`, JSON.stringify(cardTypes));
    }

    private generateCardTypeTranslations(
        cardTypePages: CardTypePage[],
    ): Map<string, CardTypeTranslation[]> {
        console.log('Generating card types translations...');

        const translations: Map<string, CardTypeTranslation[]> = new Map();

        for (const cardTypePage of cardTypePages) {
            const translationsByCardType = this.cardTypeTranslationBuilder.build(cardTypePage);

            for (const [language, translation] of translationsByCardType) {
                const translationsByLanguage = translations.get(language) ?? [];

                this.evaluateValidationResult(
                    this.cardTypeTranslationValidator.validate(translation, language, cardTypePage),
                );

                translations.set(language, translationsByLanguage.concat(translation));
            }
        }

        for (const [_, translationsByLanguage] of translations) {
            this.sortById(translationsByLanguage);
        }

        return translations;
    }

    private async writeCardTypeTranslations(
        cardTypeTranslations: Map<string, CardTypeTranslation[]>,
    ): Promise<void> {
        for (const [language, translationsByLanguage] of cardTypeTranslations) {
            await writeFile(
                `${this.targetPath}/data/card-types.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }
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

    private generateCards(
        cardPages: CardPage[],
        cardTypePages: CardTypePage[],
        cardExpansionsMap: Map<string, number[]>,
        cardTypes: CardType[],
    ): CardDto[] {
        console.log('Generating cards...');

        let cards: CardDto[] = [];

        for (const cardPage of cardPages) {
            const card = this.cardDtoBuilder.build(cardPage, cardExpansionsMap, cardTypes);

            if (card === null) {
                continue;
            }

            this.evaluateValidationResult(this.cardDtoValidator.validate(card, cardPage));

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

            this.evaluateValidationResult(this.cardDtoValidator.validate(card, cardTypePage));

            cards = cards.concat(card);
        }

        this.sortById(cards);

        this.evaluateValidationResult(this.cardDtosValidator.validate(cards, cardPages));

        return cards;
    }

    private async writeCards(cards: CardDto[]): Promise<void> {
        await writeFile(`${this.targetPath}/data/cards.json`, JSON.stringify(cards));
    }

    private generateCardTranslations(cardPages: CardPage[]): Map<string, CardTranslation[]> {
        console.log('Generating card translations...');

        const translations: Map<string, CardTranslation[]> = new Map();

        for (const cardPage of cardPages) {
            const translationsByCard = this.cardTranslationBuilder.build(cardPage);

            for (const [language, translation] of translationsByCard) {
                const translationsByLanguage = translations.get(language) ?? [];

                this.evaluateValidationResult(
                    this.cardTranslationValidator.validate(translation, language, cardPage),
                );

                translations.set(language, translationsByLanguage.concat(translation));
            }
        }

        for (const [_, translationsByLanguage] of translations) {
            this.sortById(translationsByLanguage);
        }

        return translations;
    }

    private async writeCardTranslations(
        cardTranslations: Map<string, CardTranslation[]>,
    ): Promise<void> {
        for (const [language, translationsByLanguage] of cardTranslations) {
            await writeFile(
                `${this.targetPath}/data/cards.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }
    }

    private sortById(entities: { id: number }[]): void {
        entities.sort((first, second) => first.id - second.id);
    }

    private async generateImages(
        imagePages: ImagePage[],
        subFolder: string,
    ): Promise<EncodedImage[]> {
        console.log(`Generating ${subFolder.replace('_', ' ')}...`);

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

        this.evaluateValidationResult(this.imageValidator.validate(images, imagePages));

        return images;
    }

    private evaluateValidationResult(validationResult: ValidationResult): void {
        if (validationResult === ValidationResult.Success) {
            return;
        }

        console.error(red(validationResult.failureMessage));
        this.successful = false;
    }
}
