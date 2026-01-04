import { CardTranslationValidator } from './validation/card-translation-validators';
import { ImagesValidator } from './validation/image-validators';
import { CardTypeTranslationValidator } from './validation/card-type-translation-validators';
import { ExpansionTranslationValidator } from './validation/expansion-translation-validators';
import { CardDtoValidator, CardDtosValidator } from './validation/card-dto-validators';
import { ExpansionValidator, ExpansionsValidator } from './validation/expansion-validators';
import { CardTypeValidator, CardTypesValidator } from './validation/card-type-validators';
import { CardTypeId, CardTypeTranslation } from './../../../../src/app/models/card-type';
import { CardTypeTranslationBuilder } from './builder/card-type-translation-builder';
import { CardTypeBuilder } from './builder/card-type-builder';
import { ImageBuilder, EncodedImage } from './builder/image-builder';
import { CardTranslationBuilder } from './builder/card-translation-builder';
import { CardTranslation } from './../../../../src/app/models/card';
import { ExpansionCardsMapBuilder } from './builder/expansion-cards-map-builder';
import { CardDto } from './../../../../src/app/dtos/card-dto';
import { CardDtoBuilder } from './builder/card-dto-builder';
import { ExpansionTranslationBuilder } from './builder/expansion-translation-builder';
import { Expansion, ExpansionTranslation } from './../../../../src/app/models/expansion';
import { ExpansionBuilder } from './builder/expansion-builder';
import { DominionizerWikiBot } from './dominionizer-wiki-bot';
import {
    ExpansionPage,
    CardPage,
    ImagePage,
    CardTypePage,
    ChangedImagePage,
    ContentPage,
} from './wiki-client/api-models';
import { WikiClient } from './wiki-client/wiki-client';
import Fs from 'fs/promises';
import { CardType } from '../../../../src/app/models/card-type';
import { ValidationResult } from './validation/validation-result';
import { SplitPileDependencyBuilder } from './builder/split-pile-dependency-builder';
import { DataFixture } from '../../../../src/testing/data-fixture';

describe('DominionizerWikiBot', () => {
    let dominionizerWikiBot: DominionizerWikiBot;
    let lastGenerationTime: Date;
    let currentGenerationTime: Date;
    let targetPath: string;
    let wikiClientSpy: jasmine.SpyObj<WikiClient>;
    let expansionBuilderSpy: jasmine.SpyObj<ExpansionBuilder>;
    let expansionTranslationBuilderSpy: jasmine.SpyObj<ExpansionTranslationBuilder>;
    let cardTypeBuilderSpy: jasmine.SpyObj<CardTypeBuilder>;
    let cardTypeTranslationBuilderSpy: jasmine.SpyObj<CardTypeTranslationBuilder>;
    let expansionCardsMapBuilderSpy: jasmine.SpyObj<ExpansionCardsMapBuilder>;
    let cardDtoBuilderSpy: jasmine.SpyObj<CardDtoBuilder>;
    let splitPileDependencyBuilderSpy: jasmine.SpyObj<SplitPileDependencyBuilder>;
    let cardTranslationBuilderSpy: jasmine.SpyObj<CardTranslationBuilder>;
    let imageBuilderSpy: jasmine.SpyObj<ImageBuilder>;
    let expansionValidatorSpy: jasmine.SpyObj<ExpansionValidator>;
    let expansionsValidatorSpy: jasmine.SpyObj<ExpansionsValidator>;
    let expansionTranslationValidatorSpy: jasmine.SpyObj<ExpansionTranslationValidator>;
    let cardTypeValidatorSpy: jasmine.SpyObj<CardTypeValidator>;
    let cardTypesValidatorSpy: jasmine.SpyObj<CardTypesValidator>;
    let cardTypeTranslationValidatorSpy: jasmine.SpyObj<CardTypeTranslationValidator>;
    let cardDtoValidatorSpy: jasmine.SpyObj<CardDtoValidator>;
    let cardDtosValidatorSpy: jasmine.SpyObj<CardDtosValidator>;
    let cardTranslationValidatorSpy: jasmine.SpyObj<CardTranslationValidator>;
    let imagesValidatorSpy: jasmine.SpyObj<ImagesValidator>;
    let writeFileSpy: jasmine.Spy;
    let readFileSpy: jasmine.Spy;
    let dataFixture: DataFixture;

    beforeEach(() => {
        dataFixture = new DataFixture();

        lastGenerationTime = new Date('2022-09-03T09:18:53.321Z');
        currentGenerationTime = new Date();

        targetPath = '.';

        wikiClientSpy = jasmine.createSpyObj<WikiClient>('WikiClient', [
            'fetchAllExpansionPages',
            'fetchAllCardTypePages',
            'fetchAllCardPages',
            'fetchAllCardSymbolPages',
            'fetchAllCardArtPages',
            'fetchRecentImageChanges',
            'fetchSingleContentPage',
        ]);
        wikiClientSpy.fetchAllExpansionPages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardTypePages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardPages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardSymbolPages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardArtPages.and.resolveTo([]);
        wikiClientSpy.fetchRecentImageChanges.and.resolveTo([]);

        expansionBuilderSpy = jasmine.createSpyObj<ExpansionBuilder>('ExpansionBuilder', ['build']);
        expansionBuilderSpy.build.and.returnValue([]);

        expansionTranslationBuilderSpy = jasmine.createSpyObj<ExpansionTranslationBuilder>(
            'ExpansionTranslationBuilder',
            ['build'],
        );
        expansionTranslationBuilderSpy.build.and.returnValue(new Map());

        cardTypeBuilderSpy = jasmine.createSpyObj<CardTypeBuilder>('CardTypeBuilder', ['build']);
        cardTypeBuilderSpy.build.and.returnValue({} as CardType);

        cardTypeTranslationBuilderSpy = jasmine.createSpyObj<CardTypeTranslationBuilder>(
            'CardTypeTranslationBuilde',
            ['build'],
        );
        cardTypeTranslationBuilderSpy.build.and.returnValue(new Map());

        expansionCardsMapBuilderSpy = jasmine.createSpyObj<ExpansionCardsMapBuilder>(
            'ExpansionCardsMapBuilder',
            ['buildWithExpansionPage', 'buildWithCardTypePage'],
        );
        expansionCardsMapBuilderSpy.buildWithExpansionPage.and.returnValue(new Map());
        expansionCardsMapBuilderSpy.buildWithCardTypePage.and.returnValue(new Map());

        cardDtoBuilderSpy = jasmine.createSpyObj<CardDtoBuilder>('CardDtoBuilder', ['build']);
        cardDtoBuilderSpy.build.and.returnValue(null);

        splitPileDependencyBuilderSpy = jasmine.createSpyObj<SplitPileDependencyBuilder>(
            'SplitPileDependencyBuilder',
            ['build'],
        );
        splitPileDependencyBuilderSpy.build.and.returnValue([]);

        cardTranslationBuilderSpy = jasmine.createSpyObj<CardTranslationBuilder>(
            'CardTranslationBuilder',
            ['build'],
        );
        cardTranslationBuilderSpy.build.and.returnValue(new Map());

        imageBuilderSpy = jasmine.createSpyObj<ImageBuilder>('ImageBuilder', ['build']);

        expansionValidatorSpy = jasmine.createSpyObj<ExpansionValidator>('ExpansionValidator', [
            'validate',
        ]);
        expansionValidatorSpy.validate.and.returnValue(ValidationResult.Success);
        expansionsValidatorSpy = jasmine.createSpyObj<ExpansionsValidator>('ExpansionsValidator', [
            'validate',
        ]);
        expansionsValidatorSpy.validate.and.returnValue(ValidationResult.Success);
        expansionTranslationValidatorSpy = jasmine.createSpyObj<ExpansionTranslationValidator>(
            'ExpansionTranslationValidator',
            ['validate'],
        );
        expansionTranslationValidatorSpy.validate.and.returnValue(ValidationResult.Success);
        cardTypeValidatorSpy = jasmine.createSpyObj<CardTypeValidator>('CardTypeValidator', [
            'validate',
        ]);
        cardTypeValidatorSpy.validate.and.returnValue(ValidationResult.Success);
        cardTypesValidatorSpy = jasmine.createSpyObj<CardTypesValidator>('CardTypesValidator', [
            'validate',
        ]);
        cardTypesValidatorSpy.validate.and.returnValue(ValidationResult.Success);
        cardTypeTranslationValidatorSpy = jasmine.createSpyObj<CardTypeTranslationValidator>(
            'CardTypeTranslationValidator',
            ['validate'],
        );
        cardTypeTranslationValidatorSpy.validate.and.returnValue(ValidationResult.Success);
        cardDtoValidatorSpy = jasmine.createSpyObj<CardDtoValidator>('CardDtoValidator', [
            'validate',
        ]);
        cardDtoValidatorSpy.validate.and.returnValue(ValidationResult.Success);
        cardDtosValidatorSpy = jasmine.createSpyObj<CardDtosValidator>('CardDtosValidator', [
            'validate',
        ]);
        cardDtosValidatorSpy.validate.and.returnValue(ValidationResult.Success);
        cardTranslationValidatorSpy = jasmine.createSpyObj<CardTranslationValidator>(
            'CardTranslationValidator',
            ['validate'],
        );
        cardTranslationValidatorSpy.validate.and.returnValue(ValidationResult.Success);
        imagesValidatorSpy = jasmine.createSpyObj<ImagesValidator>('ImagesValidator', ['validate']);
        imagesValidatorSpy.validate.and.returnValue(ValidationResult.Success);

        writeFileSpy = spyOn(Fs, 'writeFile');

        readFileSpy = spyOn(Fs, 'readFile');
        readFileSpy
            .withArgs('./last-generation.json', 'utf8')
            .and.resolveTo(JSON.stringify(lastGenerationTime));

        spyOn(console, 'log').and.stub();

        dominionizerWikiBot = new DominionizerWikiBot(
            currentGenerationTime,
            targetPath,
            wikiClientSpy,
            expansionBuilderSpy,
            expansionTranslationBuilderSpy,
            cardTypeBuilderSpy,
            cardTypeTranslationBuilderSpy,
            expansionCardsMapBuilderSpy,
            cardDtoBuilderSpy,
            splitPileDependencyBuilderSpy,
            cardTranslationBuilderSpy,
            imageBuilderSpy,
            expansionValidatorSpy,
            expansionsValidatorSpy,
            expansionTranslationValidatorSpy,
            cardTypeValidatorSpy,
            cardTypesValidatorSpy,
            cardTypeTranslationValidatorSpy,
            cardDtoValidatorSpy,
            cardDtosValidatorSpy,
            cardTranslationValidatorSpy,
            imagesValidatorSpy,
        );
    });

    describe('generateAll', () => {
        it('should write current generation time to file', async () => {
            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `./last-generation.json`,
                JSON.stringify(currentGenerationTime),
            );
        });

        it('should generate expansions', async () => {
            const expansionPages: ExpansionPage[] = [
                { pageid: 2 } as ExpansionPage,
                { pageid: 1 } as ExpansionPage,
            ];
            const expansions: Expansion[] = [{ id: 1 } as Expansion, { id: 2 } as Expansion];
            wikiClientSpy.fetchAllExpansionPages.and.resolveTo(expansionPages);
            expansionBuilderSpy.build.withArgs(expansionPages[0]).and.returnValue([expansions[1]]);
            expansionBuilderSpy.build.withArgs(expansionPages[1]).and.returnValue([expansions[0]]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/expansions.json`,
                JSON.stringify(expansions),
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(expansionValidatorSpy.validate).toHaveBeenCalledWith(
                expansions[0],
                expansionPages[1],
            );
            expect(expansionValidatorSpy.validate).toHaveBeenCalledWith(
                expansions[1],
                expansionPages[0],
            );
            expect(expansionsValidatorSpy.validate).toHaveBeenCalledWith(
                expansions,
                expansionPages,
            );
            /* eslint-enable */
        });

        it('should generate expansion translations', async () => {
            const expansionPages: ExpansionPage[] = [
                { pageid: 2 } as ExpansionPage,
                { pageid: 1 } as ExpansionPage,
            ];
            const firstExpansionTranslations = new Map<string, ExpansionTranslation>([
                ['German', { id: 1, name: 'german title' }],
                ['French', { id: 1, name: 'french title' }],
            ]);
            const secondExpansionTranslations = new Map<string, ExpansionTranslation>([
                ['German', { id: 2, name: 'german title' }],
                ['French', { id: 2, name: 'french title' }],
            ]);
            const germanTranslations: ExpansionTranslation[] = [
                { id: 1, name: 'german title' },
                { id: 2, name: 'german title' },
            ];
            const frenchTranslations: ExpansionTranslation[] = [
                { id: 1, name: 'french title' },
                { id: 2, name: 'french title' },
            ];
            wikiClientSpy.fetchAllExpansionPages.and.resolveTo(expansionPages);
            expansionTranslationBuilderSpy.build
                .withArgs(expansionPages[0])
                .and.returnValue(secondExpansionTranslations);
            expansionTranslationBuilderSpy.build
                .withArgs(expansionPages[1])
                .and.returnValue(firstExpansionTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/expansions.german.json`,
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/expansions.french.json`,
                JSON.stringify(frenchTranslations),
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(expansionTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[0],
                'German',
                expansionPages[1],
            );
            expect(expansionTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[1],
                'German',
                expansionPages[0],
            );
            expect(expansionTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[0],
                'French',
                expansionPages[1],
            );
            expect(expansionTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[1],
                'French',
                expansionPages[0],
            );
            /* eslint-enable */
        });

        it('should generate card types', async () => {
            const cardTypePages: CardTypePage[] = [
                { pageid: CardTypeId.Boon } as CardTypePage,
                { pageid: CardTypeId.Action } as CardTypePage,
            ];
            const cardTypes: CardType[] = [
                { id: CardTypeId.Action, name: 'Card Type 1' },
                { id: CardTypeId.Boon, name: 'Card Type 2' },
            ];
            wikiClientSpy.fetchAllCardTypePages.and.resolveTo(cardTypePages);
            cardTypeBuilderSpy.build.withArgs(cardTypePages[0]).and.returnValue(cardTypes[1]);
            cardTypeBuilderSpy.build.withArgs(cardTypePages[1]).and.returnValue(cardTypes[0]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/card-types.json`,
                JSON.stringify(cardTypes),
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(cardTypeValidatorSpy.validate).toHaveBeenCalledWith(
                cardTypes[0],
                cardTypePages[1],
            );
            expect(cardTypeValidatorSpy.validate).toHaveBeenCalledWith(
                cardTypes[1],
                cardTypePages[0],
            );
            expect(cardTypesValidatorSpy.validate).toHaveBeenCalledWith(cardTypes, cardTypePages);
            /* eslint-enable */
        });

        it('should generate card type translations', async () => {
            const cardTypePages: CardTypePage[] = [
                { pageid: CardTypeId.Boon } as CardTypePage,
                { pageid: CardTypeId.Action } as CardTypePage,
            ];
            const firstCardTypeTranslations = new Map<string, CardTypeTranslation>([
                ['German', { id: CardTypeId.Action, name: 'german title - action' }],
                ['French', { id: CardTypeId.Action, name: 'french title - action' }],
            ]);
            const secondCardTypeTranslations = new Map<string, CardTypeTranslation>([
                ['German', { id: CardTypeId.Boon, name: 'german title - boon' }],
                ['French', { id: CardTypeId.Boon, name: 'french title - boon' }],
            ]);
            const germanTranslations: CardTypeTranslation[] = [
                { id: CardTypeId.Action, name: 'german title - action' },
                { id: CardTypeId.Boon, name: 'german title - boon' },
            ];
            const frenchTranslations: CardTypeTranslation[] = [
                { id: CardTypeId.Action, name: 'french title - action' },
                { id: CardTypeId.Boon, name: 'french title - boon' },
            ];
            wikiClientSpy.fetchAllCardTypePages.and.resolveTo(cardTypePages);
            cardTypeTranslationBuilderSpy.build
                .withArgs(cardTypePages[0])
                .and.returnValue(secondCardTypeTranslations);
            cardTypeTranslationBuilderSpy.build
                .withArgs(cardTypePages[1])
                .and.returnValue(firstCardTypeTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/card-types.german.json`,
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/card-types.french.json`,
                JSON.stringify(frenchTranslations),
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(cardTypeTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[0],
                'German',
                cardTypePages[1],
            );
            expect(cardTypeTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[1],
                'German',
                cardTypePages[0],
            );
            expect(cardTypeTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[0],
                'French',
                cardTypePages[1],
            );
            expect(cardTypeTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[1],
                'French',
                cardTypePages[0],
            );
            /* eslint-enable */
        });

        it('should generate card symbols', async () => {
            const cardSymbolPages: ImagePage[] = [
                { pageid: 100, title: 'File:First.png' } as ImagePage,
                { pageid: 200, title: 'File:Second.png' } as ImagePage,
            ];
            const firstEncodedImage: EncodedImage = {
                id: 100,
                fileName: 'First.png',
                data: new Uint8Array([1, 2]),
            };
            const secondEncodedImage: EncodedImage = {
                id: 200,
                fileName: 'Second.png',
                data: new Uint8Array([3, 4]),
            };
            wikiClientSpy.fetchAllCardSymbolPages.and.resolveTo(cardSymbolPages);
            imageBuilderSpy.build.withArgs(cardSymbolPages[0]).and.resolveTo(firstEncodedImage);
            imageBuilderSpy.build.withArgs(cardSymbolPages[1]).and.resolveTo(secondEncodedImage);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_symbols/${firstEncodedImage.fileName}`,
                firstEncodedImage.data,
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_symbols/${secondEncodedImage.fileName}`,
                secondEncodedImage.data,
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(imagesValidatorSpy.validate).toHaveBeenCalledWith(
                [firstEncodedImage, secondEncodedImage],
                cardSymbolPages,
            );
            /* eslint-enable */
        });

        it('should generate card art', async () => {
            const cardArtPages: ImagePage[] = [
                { pageid: 101, title: 'File:First.jpg' } as ImagePage,
                { pageid: 201, title: 'File:Second.jpg' } as ImagePage,
            ];
            const firstEncodedImage: EncodedImage = {
                id: 101,
                fileName: 'First.jpg',
                data: new Uint8Array([1, 2]),
            };
            const secondEncodedImage: EncodedImage = {
                id: 201,
                fileName: 'Second.jpg',
                data: new Uint8Array([3, 4]),
            };
            wikiClientSpy.fetchAllCardArtPages.and.resolveTo(cardArtPages);
            imageBuilderSpy.build.withArgs(cardArtPages[0]).and.resolveTo(firstEncodedImage);
            imageBuilderSpy.build.withArgs(cardArtPages[1]).and.resolveTo(secondEncodedImage);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_art/${firstEncodedImage.fileName}`,
                firstEncodedImage.data,
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_art/${secondEncodedImage.fileName}`,
                secondEncodedImage.data,
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(imagesValidatorSpy.validate).toHaveBeenCalledWith(
                [firstEncodedImage, secondEncodedImage],
                cardArtPages,
            );
            /* eslint-enable */
        });

        it('with skipImages is true should not generate images', async () => {
            await dominionizerWikiBot.generateAll(true);

            /* eslint-disable @typescript-eslint/unbound-method */
            expect(wikiClientSpy.fetchAllCardSymbolPages).not.toHaveBeenCalled();
            expect(wikiClientSpy.fetchAllCardArtPages).not.toHaveBeenCalled();
            expect(imageBuilderSpy.build).not.toHaveBeenCalled();
            /* eslint-enable */
        });

        it('should generate cards', async () => {
            const expansionPages: ExpansionPage[] = [
                { pageid: 1 } as ExpansionPage,
                { pageid: 2 } as ExpansionPage,
            ];
            const expansionCardsMap = new Map<number, string[]>([
                [1, ['Curse', 'Cellar', 'Knights']],
                [2, ['Cellar']],
            ]);
            const cardTypePages: CardTypePage[] = [
                { pageid: CardTypeId.Curse, title: 'Curse' } as CardTypePage,
                { pageid: CardTypeId.Knight, title: 'Knights' } as CardTypePage,
                { pageid: CardTypeId.Ally, title: 'Ally' } as CardTypePage,
            ];
            const cardTypes: CardType[] = [
                dataFixture.createCardType({ id: CardTypeId.Curse }),
                dataFixture.createCardType({ id: CardTypeId.Knight }),
                dataFixture.createCardType({ id: CardTypeId.Ally }),
            ];
            const cardPages: CardPage[] = [
                { pageid: 300, title: 'Cellar' } as CardPage,
                { pageid: CardTypeId.Curse, title: 'Curse' } as CardPage,
            ];
            const cardExpansionsMap = new Map<string, number[]>([
                ['Curse', [1]],
                ['Cellar', [1, 2]],
                ['Knights', [1]],
            ]);
            const cards: CardDto[] = [
                { id: CardTypeId.Curse, name: 'Curse', expansions: [1] } as CardDto,
                { id: 300, name: 'Cellar', expansions: [1, 2] } as CardDto,
                { id: CardTypeId.Knight, name: 'Knights', expansions: [1] } as CardDto,
            ];
            const splitPilePage: ContentPage = { pageid: 100, title: 'Split pile' } as ContentPage;
            wikiClientSpy.fetchAllExpansionPages.and.resolveTo(expansionPages);
            wikiClientSpy.fetchAllCardPages.and.resolveTo(cardPages);
            wikiClientSpy.fetchAllCardTypePages.and.resolveTo(cardTypePages);
            wikiClientSpy.fetchSingleContentPage
                .withArgs('Split pile')
                .and.resolveTo(splitPilePage);
            cardTypeBuilderSpy.build.withArgs(cardTypePages[0]).and.returnValue(cardTypes[0]);
            cardTypeBuilderSpy.build.withArgs(cardTypePages[1]).and.returnValue(cardTypes[1]);
            cardTypeBuilderSpy.build.withArgs(cardTypePages[2]).and.returnValue(cardTypes[2]);
            expansionCardsMapBuilderSpy.buildWithExpansionPage
                .withArgs(expansionPages[0])
                .and.returnValue(new Map([[1, ['Curse', 'Cellar', 'Knights']]]));
            expansionCardsMapBuilderSpy.buildWithExpansionPage
                .withArgs(expansionPages[1])
                .and.returnValue(new Map([[2, ['Cellar']]]));
            expansionCardsMapBuilderSpy.buildWithCardTypePage
                .withArgs(cardTypePages[0], expansionCardsMap)
                .and.returnValue(new Map([[1, ['Curse']]]));
            expansionCardsMapBuilderSpy.buildWithCardTypePage
                .withArgs(cardTypePages[1], expansionCardsMap)
                .and.returnValue(new Map([[1, ['Knights']]]));
            expansionCardsMapBuilderSpy.buildWithCardTypePage
                .withArgs(cardTypePages[2], expansionCardsMap)
                .and.returnValue(new Map());
            cardDtoBuilderSpy.build
                .withArgs(cardPages[0], cardExpansionsMap, cardTypes, undefined)
                .and.returnValue(cards[1]);
            cardDtoBuilderSpy.build
                .withArgs(cardPages[1], cardExpansionsMap, cardTypes, undefined)
                .and.returnValue(cards[0]);
            cardDtoBuilderSpy.build
                .withArgs(cardTypePages[0], cardExpansionsMap, cardTypes)
                .and.returnValue(cards[0]);
            cardDtoBuilderSpy.build
                .withArgs(cardTypePages[1], cardExpansionsMap, cardTypes)
                .and.returnValue(cards[2]);
            cardDtoBuilderSpy.build
                .withArgs(cardTypePages[2], cardExpansionsMap, cardTypes)
                .and.returnValue(null);
            splitPileDependencyBuilderSpy.build.and.returnValue(cards);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/cards.json`,
                JSON.stringify(cards),
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(cardDtoValidatorSpy.validate).toHaveBeenCalledWith(cards[0], cardPages[1]);
            expect(cardDtoValidatorSpy.validate).toHaveBeenCalledWith(cards[1], cardPages[0]);
            expect(cardDtoValidatorSpy.validate).toHaveBeenCalledWith(cards[2], cardTypePages[1]);
            expect(cardDtosValidatorSpy.validate).toHaveBeenCalledWith(cards, cardPages);
            expect(splitPileDependencyBuilderSpy.build).toHaveBeenCalledWith(
                cards,
                cardTypes,
                splitPilePage,
            );
            expect(wikiClientSpy.fetchAllCardSymbolPages).toHaveBeenCalledBefore(
                cardDtoValidatorSpy.validate,
            );
            expect(wikiClientSpy.fetchAllCardArtPages).toHaveBeenCalledBefore(
                cardDtoValidatorSpy.validate,
            );
            expect(imagesValidatorSpy.validate).toHaveBeenCalledBefore(
                cardDtoValidatorSpy.validate,
            );
            /* eslint-enable */
        });

        it('with card page redirect should generate cards correctly', async () => {
            const cardPages: CardPage[] = [
                {
                    pageid: 10,
                    title: 'Card 10',
                    revisions: [{ '*': '#REDIRECT [[Card 20]]' }],
                } as CardPage,
                { pageid: 20, title: 'Card 20' } as CardPage,
            ];
            const cards: CardDto[] = [
                { id: 10, name: 'Card 10' } as CardDto,
                { id: 20, name: 'Card 20' } as CardDto,
            ];
            wikiClientSpy.fetchAllCardPages.and.resolveTo(cardPages);
            cardDtoBuilderSpy.build
                .withArgs(cardPages[1], jasmine.any(Map), jasmine.any(Array), cardPages[0])
                .and.returnValue(cards[0]);
            cardDtoBuilderSpy.build
                .withArgs(cardPages[1], jasmine.any(Map), jasmine.any(Array), undefined)
                .and.returnValue(cards[1]);
            splitPileDependencyBuilderSpy.build.and.returnValue(cards);

            await dominionizerWikiBot.generateAll();

            /* eslint-disable @typescript-eslint/unbound-method */
            expect(cardDtoValidatorSpy.validate).toHaveBeenCalledWith(cards[0], cardPages[1]);
            expect(cardDtoValidatorSpy.validate).toHaveBeenCalledWith(cards[1], cardPages[1]);
            /* eslint-enable */
        });

        it('should generate card translations', async () => {
            const cardPages: CardPage[] = [{ pageid: 20 } as CardPage, { pageid: 10 } as CardPage];
            const cards: CardDto[] = [{ id: 10 } as CardDto, { id: 20 } as CardDto];
            const firstCardTranslations = new Map<string, CardTranslation>([
                ['German', { id: 10, name: 'german title' } as CardTranslation],
                ['French', { id: 10, name: 'french title' } as CardTranslation],
            ]);
            const secondCardTranslations = new Map<string, CardTranslation>([
                ['German', { id: 20, name: 'german title' } as CardTranslation],
                ['French', { id: 20, name: 'french title' } as CardTranslation],
            ]);
            const germanTranslations: CardTranslation[] = [
                { id: 10, name: 'german title' } as CardTranslation,
                { id: 20, name: 'german title' } as CardTranslation,
            ];
            const frenchTranslations: CardTranslation[] = [
                { id: 10, name: 'french title' } as CardTranslation,
                { id: 20, name: 'french title' } as CardTranslation,
            ];
            wikiClientSpy.fetchAllCardPages.and.resolveTo(cardPages);
            cardDtoBuilderSpy.build
                .withArgs(cardPages[0], jasmine.anything(), jasmine.anything())
                .and.returnValue(cards[1]);
            cardDtoBuilderSpy.build
                .withArgs(cardPages[1], jasmine.anything(), jasmine.anything())
                .and.returnValue(cards[0]);
            cardTranslationBuilderSpy.build
                .withArgs(cardPages[0])
                .and.returnValue(secondCardTranslations);
            cardTranslationBuilderSpy.build
                .withArgs(cardPages[1])
                .and.returnValue(firstCardTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/cards.german.json`,
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/cards.french.json`,
                JSON.stringify(frenchTranslations),
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(cardTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[0],
                'German',
                cardPages[1],
            );
            expect(cardTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[1],
                'German',
                cardPages[0],
            );
            expect(cardTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[0],
                'French',
                cardPages[1],
            );
            expect(cardTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[1],
                'French',
                cardPages[0],
            );
            /* eslint-enable */
        });
    });

    describe('generateUpdate', () => {
        it('should write current generation time to file', async () => {
            await dominionizerWikiBot.generateUpdate();

            expect(writeFileSpy).toHaveBeenCalledWith(
                './last-generation.json',
                JSON.stringify(currentGenerationTime),
            );
        });

        it('with changed image pages should generate those images', async () => {
            const changedImagePages: ChangedImagePage[] = [
                {
                    pageid: 100,
                    title: 'File:CardSymbol.png',
                    categories: [{ title: 'Category:Card symbols' }],
                } as ChangedImagePage,
                {
                    pageid: 200,
                    title: 'File:CardArt.jpg',
                    categories: [{ title: 'Category:Card art' }],
                } as ChangedImagePage,
                {
                    pageid: 300,
                    title: 'File:OtherImage.jpg',
                } as ChangedImagePage,
            ];
            const encodedCardSymbol: EncodedImage = {
                id: 100,
                fileName: 'CardSymbol.png',
                data: new Uint8Array([1, 2]),
            };
            const encodedCardArt: EncodedImage = {
                id: 200,
                fileName: 'CardArt.jpg',
                data: new Uint8Array([3, 4]),
            };
            wikiClientSpy.fetchRecentImageChanges
                .withArgs(lastGenerationTime)
                .and.resolveTo(changedImagePages);
            imageBuilderSpy.build.withArgs(changedImagePages[0]).and.resolveTo(encodedCardSymbol);
            imageBuilderSpy.build.withArgs(changedImagePages[1]).and.resolveTo(encodedCardArt);

            await dominionizerWikiBot.generateUpdate();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_symbols/${encodedCardSymbol.fileName}`,
                encodedCardSymbol.data,
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_art/${encodedCardArt.fileName}`,
                encodedCardArt.data,
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(imagesValidatorSpy.validate).toHaveBeenCalledWith(
                [encodedCardSymbol],
                [changedImagePages[0]],
            );
            expect(imagesValidatorSpy.validate).toHaveBeenCalledWith(
                [encodedCardArt],
                [changedImagePages[1]],
            );
            /* eslint-enable */
        });

        it('with skipImages is true should not generate images', async () => {
            await dominionizerWikiBot.generateUpdate(true);

            /* eslint-disable @typescript-eslint/unbound-method */
            expect(wikiClientSpy.fetchRecentImageChanges).not.toHaveBeenCalled();
            expect(imageBuilderSpy.build).not.toHaveBeenCalled();
            /* eslint-enable */
        });

        it('should generate all without images', async () => {
            const generateAllSpy = spyOn(dominionizerWikiBot, 'generateAll');

            await dominionizerWikiBot.generateUpdate();

            expect(generateAllSpy).toHaveBeenCalledWith(true);
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(wikiClientSpy.fetchRecentImageChanges).toHaveBeenCalledBefore(generateAllSpy);
            expect(imagesValidatorSpy.validate).toHaveBeenCalledBefore(generateAllSpy);
            /* eslint-enable */
        });
    });
});
