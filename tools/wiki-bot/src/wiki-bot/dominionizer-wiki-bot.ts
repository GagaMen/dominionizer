import { ImagesValidator } from './validation/image-validators';
import { CardTranslationValidator } from './validation/card-translation-validators';
import { CardDtoValidator } from './validation/card-dto-validators';
import { CardTypeTranslationValidator } from './validation/card-type-translation-validators';
import { EditionTranslationValidator } from './validation/edition-translation-validators';
import { EditionValidator } from './validation/edition-validators';
import { CardTypeValidator } from './validation/card-type-validators';
import { CardTypeTranslationBuilder } from './builder/card-type-translation-builder';
import { CardTypeBuilder } from './builder/card-type-builder';
import { EncodedImage, ImageBuilder } from './builder/image-builder';
import { CardTranslationBuilder } from './builder/card-translation-builder';
import { CardTranslation } from './../../../../src/app/models/card';
import { CardDtoBuilder } from './builder/card-dto-builder';
import { EditionTranslationBuilder } from './builder/edition-translation-builder';
import { Edition, EditionTranslation } from './../../../../src/app/models/edition';
import { EditionBuilder } from './builder/edition-builder';
import { WikiClient } from './wiki-client/wiki-client';
import {
    ExpansionPage,
    CardPage,
    ImagePage,
    CardTypePage,
    ChangedImagePage,
    CargoEdition,
    CargoCard,
    CargoCardType,
} from './wiki-client/api-models';
import { CardType, CardTypeTranslation } from 'src/app/models/card-type';
import { CardDto } from '../../../../src/app/dtos/card-dto';
import * as fs from 'fs';
import { ValidationResult } from './validation/validation-result';

export class DominionizerWikiBot {
    private successful = true;

    constructor(
        private currentGenerationTime: Date,
        private targetPath: string,
        private wikiClient: WikiClient,
        private editionBuilder: EditionBuilder,
        private editionTranslationBuilder: EditionTranslationBuilder,
        private cardTypeBuilder: CardTypeBuilder,
        private cardTypeTranslationBuilder: CardTypeTranslationBuilder,
        private cardDtoBuilder: CardDtoBuilder,
        private cardTranslationBuilder: CardTranslationBuilder,
        private imageBuilder: ImageBuilder,
        private editionValidator: EditionValidator,
        private editionTranslationValidator: EditionTranslationValidator,
        private cardTypeValidator: CardTypeValidator,
        private cardTypeTranslationValidator: CardTypeTranslationValidator,
        private cardDtoValidator: CardDtoValidator,
        private cardTranslationValidator: CardTranslationValidator,
        private imagesValidator: ImagesValidator,
    ) {}

    async generateAll(skipImages = false): Promise<boolean> {
        await this.writeCurrentGenerationTime();

        const cargoEditions = await this.wikiClient.fetchAllEditions();
        const editions = this.generateEditions(cargoEditions);
        await this.writeEditions(editions);

        const expansionPages = await this.wikiClient.fetchAllExpansionPages();
        const editionTranslations = this.generateEditionTranslations(expansionPages, cargoEditions);
        await this.writeEditionTranslations(editionTranslations);

        const cargoCardTypes = await this.wikiClient.fetchAllCardTypes();
        const cardTypes = this.generateCardTypes(cargoCardTypes);
        await this.writeCardTypes(cardTypes);

        const cardTypePages = await this.wikiClient.fetchAllCardTypePages();
        const cardTypeTranslations = this.generateCardTypeTranslations(
            cardTypePages,
            cargoCardTypes,
        );
        await this.writeCardTypeTranslations(cardTypeTranslations);

        if (!skipImages) {
            const cardSymbolPages = await this.wikiClient.fetchAllCardSymbolPages();
            await this.generateImages(cardSymbolPages, 'card_symbols');

            const cardArtPages = await this.wikiClient.fetchAllCardArtPages();
            await this.generateImages(cardArtPages, 'card_art');
        }

        const cargoCards = await this.wikiClient.fetchAllCards();
        const cardPages = await this.wikiClient.fetchAllCardPages();
        const cards = this.generateCards(cargoCards, cardPages, cardTypePages, editions, cardTypes);
        await this.writeCards(cards);

        const cardTranslations = this.generateCardTranslations(
            cargoCards,
            cardPages,
            cardTypePages,
        );
        await this.writeCardTranslations(cardTranslations);

        return this.successful;
    }

    async generateUpdate(skipImages = false): Promise<boolean> {
        const lastGenerationTime = await this.readLastGenerationTime();
        await this.writeCurrentGenerationTime();

        if (!skipImages) {
            const changedImagePages =
                await this.wikiClient.fetchRecentImageChanges(lastGenerationTime);
            const groupedImagePages = this.groupChangedImagePagesByCategory(changedImagePages);
            await this.generateImages(
                groupedImagePages.get('Category:Card symbols') ?? [],
                'card_symbols',
            );
            await this.generateImages(groupedImagePages.get('Category:Card art') ?? [], 'card_art');
        }

        await this.generateAll(true);

        return this.successful;
    }

    private async readLastGenerationTime(): Promise<Date> {
        const lastGenerationTimeJsonString = await fs.promises.readFile(
            './last-generation.json',
            'utf8',
        );

        return new Date(JSON.parse(lastGenerationTimeJsonString) as string);
    }

    private async writeCurrentGenerationTime(): Promise<void> {
        await fs.promises.writeFile(
            './last-generation.json',
            JSON.stringify(this.currentGenerationTime),
        );
    }

    private groupChangedImagePagesByCategory(
        changedImagePages: ChangedImagePage[],
    ): Map<string, ChangedImagePage[]> {
        const groupedPages = new Map<string, ChangedImagePage[]>();

        for (const page of changedImagePages) {
            if (page.categories === undefined) {
                continue;
            }

            for (const category of page.categories) {
                const pagesOfCategory = groupedPages.get(category.title) ?? [];
                pagesOfCategory.push(page);
                groupedPages.set(category.title, pagesOfCategory);
            }
        }

        return groupedPages;
    }

    private generateEditions(cargoEditions: CargoEdition[]): Edition[] {
        console.log('Generating editions...');

        const editions: Edition[] = [];

        for (const cargoEdition of cargoEditions) {
            const edition = this.editionBuilder.build(cargoEdition);
            this.evaluateValidationResult(this.editionValidator.validate(edition));
            editions.push(edition);
        }

        this.sortById(editions);

        return editions;
    }

    private async writeEditions(editions: Edition[]): Promise<void> {
        await fs.promises.writeFile(
            `${this.targetPath}/data/editions.json`,
            JSON.stringify(editions),
        );
    }

    private generateEditionTranslations(
        expansionPages: ExpansionPage[],
        cargoEditions: CargoEdition[],
    ): Map<string, EditionTranslation[]> {
        console.log('Generating edition translations...');

        const translations = new Map<string, EditionTranslation[]>();

        for (const expansionPage of expansionPages) {
            const filteredEditions = cargoEditions.filter(
                (cargoEdition) => String(expansionPage.pageid) === cargoEdition.PageId,
            );
            const translationsByEdition = this.editionTranslationBuilder.build(
                expansionPage,
                filteredEditions,
            );

            for (const [language, editionTranslations] of translationsByEdition) {
                const translationsByLanguage = translations.get(language) ?? [];

                for (const editionTranslation of editionTranslations) {
                    const cargoEdition = filteredEditions.find(
                        (cargoEdition) => cargoEdition.Id === editionTranslation.id,
                    );
                    if (cargoEdition !== undefined) {
                        this.evaluateValidationResult(
                            this.editionTranslationValidator.validate(
                                editionTranslation,
                                language,
                                cargoEdition,
                            ),
                        );
                    }
                }

                translations.set(language, translationsByLanguage.concat(editionTranslations));
            }
        }

        for (const [_, translationsByLanguage] of translations) {
            this.sortById(translationsByLanguage);
        }

        return translations;
    }

    private async writeEditionTranslations(
        editionTranslations: Map<string, EditionTranslation[]>,
    ): Promise<void> {
        for (const [language, translationsByLanguage] of editionTranslations) {
            await fs.promises.writeFile(
                `${this.targetPath}/data/editions.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }
    }

    private generateCardTypes(cargoCardTypes: CargoCardType[]): CardType[] {
        console.log('Generating card types...');

        const cardTypes: CardType[] = [];

        for (const cargoCardType of cargoCardTypes) {
            const cardType = this.cardTypeBuilder.build(cargoCardType);
            this.evaluateValidationResult(this.cardTypeValidator.validateFromCargo(cardType));
            cardTypes.push(cardType);
        }

        this.sortById(cardTypes);

        return cardTypes;
    }

    private async writeCardTypes(cardTypes: CardType[]): Promise<void> {
        await fs.promises.writeFile(
            `${this.targetPath}/data/card-types.json`,
            JSON.stringify(cardTypes),
        );
    }

    private generateCardTypeTranslations(
        cardTypePages: CardTypePage[],
        cargoCardTypes: CargoCardType[],
    ): Map<string, CardTypeTranslation[]> {
        console.log('Generating card types translations...');

        const translations = new Map<string, CardTypeTranslation[]>();

        for (const cardTypePage of cardTypePages) {
            const cargoCardType = cargoCardTypes.find(
                (cargoCardType) => String(cardTypePage.pageid) === cargoCardType.PageId,
            );
            if (cargoCardType === undefined) {
                continue;
            }

            const translationsByCardType = this.cardTypeTranslationBuilder.build(
                cardTypePage,
                cargoCardType,
            );

            for (const [language, translation] of translationsByCardType) {
                const translationsByLanguage = translations.get(language) ?? [];

                this.evaluateValidationResult(
                    this.cardTypeTranslationValidator.validateFromCargo(
                        translation,
                        language,
                        cargoCardType,
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

    private async writeCardTypeTranslations(
        cardTypeTranslations: Map<string, CardTypeTranslation[]>,
    ): Promise<void> {
        for (const [language, translationsByLanguage] of cardTypeTranslations) {
            await fs.promises.writeFile(
                `${this.targetPath}/data/card-types.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }
    }

    private generateCards(
        cargoCards: CargoCard[],
        cardPages: CardPage[],
        cardTypePages: CardTypePage[],
        editions: Edition[],
        cardTypes: CardType[],
    ): CardDto[] {
        console.log('Generating cards...');

        const allPages: (CardPage | CardTypePage)[] = [...cardPages, ...cardTypePages];
        const cards: CardDto[] = [];

        for (const cargoCard of cargoCards) {
            const page = allPages.find((page) => String(page.pageid) === cargoCard.PageId);
            if (page === undefined) {
                continue;
            }

            const card = this.cardDtoBuilder.build(cargoCard, page, editions, cardTypes);
            this.evaluateValidationResult(this.cardDtoValidator.validateFromCargo(card));
            cards.push(card);
        }

        this.sortById(cards);

        return cards;
    }

    private async writeCards(cards: CardDto[]): Promise<void> {
        await fs.promises.writeFile(`${this.targetPath}/data/cards.json`, JSON.stringify(cards));
    }

    private generateCardTranslations(
        cargoCards: CargoCard[],
        cardPages: CardPage[],
        cardTypePages: CardTypePage[],
    ): Map<string, CardTranslation[]> {
        console.log('Generating card translations...');

        const allPages: (CardPage | CardTypePage)[] = [...cardPages, ...cardTypePages];
        const translations = new Map<string, CardTranslation[]>();

        for (const cargoCard of cargoCards) {
            const page = allPages.find((page) => String(page.pageid) === cargoCard.PageId);
            if (page === undefined) {
                continue;
            }

            const translationsByCard = this.cardTranslationBuilder.build(page, cargoCard);

            for (const [language, translation] of translationsByCard) {
                const translationsByLanguage = translations.get(language) ?? [];

                this.evaluateValidationResult(
                    this.cardTranslationValidator.validateFromCargo(
                        translation,
                        language,
                        cargoCard,
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

    private async writeCardTranslations(
        cardTranslations: Map<string, CardTranslation[]>,
    ): Promise<void> {
        for (const [language, translationsByLanguage] of cardTranslations) {
            await fs.promises.writeFile(
                `${this.targetPath}/data/cards.${language.toLowerCase()}.json`,
                JSON.stringify(translationsByLanguage),
            );
        }
    }

    private sortById(entities: { id: string }[]): void {
        entities.sort((first, second) => first.id.localeCompare(second.id));
    }

    private async generateImages(
        imagePages: ImagePage[],
        subFolder: string,
    ): Promise<EncodedImage[]> {
        console.log(`Generating ${subFolder.replace('_', ' ')}...`);

        await fs.promises.mkdir(`${this.targetPath}/assets/${subFolder}`, { recursive: true });

        const images: EncodedImage[] = [];
        for (const imagePage of imagePages) {
            const encodedImage = await this.imageBuilder.build(imagePage);
            if (encodedImage === null) continue;

            images.push(encodedImage);

            await fs.promises.writeFile(
                `${this.targetPath}/assets/${subFolder}/${encodedImage.fileName}`,
                encodedImage.data,
            );
        }

        this.evaluateValidationResult(this.imagesValidator.validate(images, imagePages));

        return images;
    }

    private evaluateValidationResult(validationResult: ValidationResult): void {
        if (validationResult === ValidationResult.Success) {
            return;
        }

        console.error(validationResult.failureMessage);
        this.successful = false;
    }
}
