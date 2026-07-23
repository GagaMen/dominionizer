import { CardTranslationValidator } from './validation/card-translation-validators';
import { ImagesValidator } from './validation/image-validators';
import { CardTypeTranslationValidator } from './validation/card-type-translation-validators';
import { EditionTranslationValidator } from './validation/edition-translation-validators';
import { EditionValidator } from './validation/edition-validators';
import { CardDtoValidator } from './validation/card-dto-validators';
import { CardTypeValidator } from './validation/card-type-validators';
import { CardTypeTranslationBuilder } from './builder/card-type-translation-builder';
import { CardTypeBuilder } from './builder/card-type-builder';
import { ImageBuilder, EncodedImage } from './builder/image-builder';
import { CardTranslationBuilder } from './builder/card-translation-builder';
import { CardDtoBuilder } from './builder/card-dto-builder';
import { EditionTranslationBuilder } from './builder/edition-translation-builder';
import { EditionBuilder } from './builder/edition-builder';
import { DominionizerWikiBot } from './dominionizer-wiki-bot';
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
import { WikiClient } from './wiki-client/wiki-client';
import * as fs from 'fs';
import { Edition, EditionTranslation } from '../../../../src/app/models/edition';
import { CardType, CardTypeTranslation } from '../../../../src/app/models/card-type';
import { CardDto } from '../../../../src/app/dtos/card-dto';
import { CardTranslation } from '../../../../src/app/models/card';
import { ValidationResult } from './validation/validation-result';

describe('DominionizerWikiBot', () => {
    let dominionizerWikiBot: DominionizerWikiBot;
    let lastGenerationTime: Date;
    let currentGenerationTime: Date;
    let targetPath: string;
    let wikiClientSpy: jasmine.SpyObj<WikiClient>;
    let editionBuilderSpy: jasmine.SpyObj<EditionBuilder>;
    let editionTranslationBuilderSpy: jasmine.SpyObj<EditionTranslationBuilder>;
    let cardTypeBuilderSpy: jasmine.SpyObj<CardTypeBuilder>;
    let cardTypeTranslationBuilderSpy: jasmine.SpyObj<CardTypeTranslationBuilder>;
    let cardDtoBuilderSpy: jasmine.SpyObj<CardDtoBuilder>;
    let cardTranslationBuilderSpy: jasmine.SpyObj<CardTranslationBuilder>;
    let imageBuilderSpy: jasmine.SpyObj<ImageBuilder>;
    let editionValidatorSpy: jasmine.SpyObj<EditionValidator>;
    let editionTranslationValidatorSpy: jasmine.SpyObj<EditionTranslationValidator>;
    let cardTypeValidatorSpy: jasmine.SpyObj<CardTypeValidator>;
    let cardTypeTranslationValidatorSpy: jasmine.SpyObj<CardTypeTranslationValidator>;
    let cardDtoValidatorSpy: jasmine.SpyObj<CardDtoValidator>;
    let cardTranslationValidatorSpy: jasmine.SpyObj<CardTranslationValidator>;
    let imagesValidatorSpy: jasmine.SpyObj<ImagesValidator>;
    let writeFileSpy: jasmine.Spy;
    let readFileSpy: jasmine.Spy;

    beforeEach(() => {
        lastGenerationTime = new Date('2022-09-03T09:18:53.321Z');
        currentGenerationTime = new Date();

        targetPath = '.';

        wikiClientSpy = jasmine.createSpyObj<WikiClient>('WikiClient', [
            'fetchAllEditions',
            'fetchAllCardTypes',
            'fetchAllCards',
            'fetchAllExpansionPages',
            'fetchAllCardTypePages',
            'fetchAllCardPages',
            'fetchAllCardSymbolPages',
            'fetchAllCardArtPages',
            'fetchRecentImageChanges',
        ]);
        wikiClientSpy.fetchAllEditions.and.resolveTo([]);
        wikiClientSpy.fetchAllCardTypes.and.resolveTo([]);
        wikiClientSpy.fetchAllCards.and.resolveTo([]);
        wikiClientSpy.fetchAllExpansionPages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardTypePages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardPages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardSymbolPages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardArtPages.and.resolveTo([]);
        wikiClientSpy.fetchRecentImageChanges.and.resolveTo([]);

        editionBuilderSpy = jasmine.createSpyObj<EditionBuilder>('EditionBuilder', ['build']);
        editionBuilderSpy.build.and.returnValue({ id: '' } as unknown as Edition);

        editionTranslationBuilderSpy = jasmine.createSpyObj<EditionTranslationBuilder>(
            'EditionTranslationBuilder',
            ['build'],
        );
        editionTranslationBuilderSpy.build.and.returnValue(new Map());

        cardTypeBuilderSpy = jasmine.createSpyObj<CardTypeBuilder>('CardTypeBuilder', ['build']);
        cardTypeBuilderSpy.build.and.returnValue({ id: '' } as unknown as CardType);

        cardTypeTranslationBuilderSpy = jasmine.createSpyObj<CardTypeTranslationBuilder>(
            'CardTypeTranslationBuilder',
            ['build'],
        );
        cardTypeTranslationBuilderSpy.build.and.returnValue(new Map());

        cardDtoBuilderSpy = jasmine.createSpyObj<CardDtoBuilder>('CardDtoBuilder', ['build']);
        cardDtoBuilderSpy.build.and.returnValue({ id: '' } as unknown as CardDto);

        cardTranslationBuilderSpy = jasmine.createSpyObj<CardTranslationBuilder>(
            'CardTranslationBuilder',
            ['build'],
        );
        cardTranslationBuilderSpy.build.and.returnValue(new Map());

        imageBuilderSpy = jasmine.createSpyObj<ImageBuilder>('ImageBuilder', ['build']);

        editionValidatorSpy = jasmine.createSpyObj<EditionValidator>('EditionValidator', [
            'validate',
        ]);
        editionValidatorSpy.validate.and.returnValue(ValidationResult.Success);

        editionTranslationValidatorSpy = jasmine.createSpyObj<EditionTranslationValidator>(
            'EditionTranslationValidator',
            ['validate'],
        );
        editionTranslationValidatorSpy.validate.and.returnValue(ValidationResult.Success);

        cardTypeValidatorSpy = jasmine.createSpyObj<CardTypeValidator>('CardTypeValidator', [
            'validate',
            'validateFromCargo',
        ]);
        cardTypeValidatorSpy.validateFromCargo.and.returnValue(ValidationResult.Success);

        cardTypeTranslationValidatorSpy = jasmine.createSpyObj<CardTypeTranslationValidator>(
            'CardTypeTranslationValidator',
            ['validate', 'validateFromCargo'],
        );
        cardTypeTranslationValidatorSpy.validateFromCargo.and.returnValue(ValidationResult.Success);

        cardDtoValidatorSpy = jasmine.createSpyObj<CardDtoValidator>('CardDtoValidator', [
            'validate',
            'validateFromCargo',
        ]);
        cardDtoValidatorSpy.validateFromCargo.and.returnValue(ValidationResult.Success);

        cardTranslationValidatorSpy = jasmine.createSpyObj<CardTranslationValidator>(
            'CardTranslationValidator',
            ['validate', 'validateFromCargo'],
        );
        cardTranslationValidatorSpy.validateFromCargo.and.returnValue(ValidationResult.Success);

        imagesValidatorSpy = jasmine.createSpyObj<ImagesValidator>('ImagesValidator', ['validate']);
        imagesValidatorSpy.validate.and.returnValue(ValidationResult.Success);

        writeFileSpy = spyOn(fs.promises, 'writeFile');

        readFileSpy = spyOn(fs.promises, 'readFile');
        readFileSpy
            .withArgs('./last-generation.json', 'utf8')
            .and.resolveTo(JSON.stringify(lastGenerationTime));

        spyOn(console, 'log').and.stub();

        dominionizerWikiBot = new DominionizerWikiBot(
            currentGenerationTime,
            targetPath,
            wikiClientSpy,
            editionBuilderSpy,
            editionTranslationBuilderSpy,
            cardTypeBuilderSpy,
            cardTypeTranslationBuilderSpy,
            cardDtoBuilderSpy,
            cardTranslationBuilderSpy,
            imageBuilderSpy,
            editionValidatorSpy,
            editionTranslationValidatorSpy,
            cardTypeValidatorSpy,
            cardTypeTranslationValidatorSpy,
            cardDtoValidatorSpy,
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

        it('should generate editions', async () => {
            const cargoEditions: CargoEdition[] = [
                {
                    Id: 'base-2e',
                    PageId: '1',
                    Expansion: 'Dominion',
                    Edition: '2',
                    Icon: 'dom2e.png',
                },
                {
                    Id: 'base-1e',
                    PageId: '1',
                    Expansion: 'Dominion',
                    Edition: '1',
                    Icon: 'dom1e.png',
                },
            ];
            const editions: Edition[] = [
                { id: 'base-1e', expansion: 'Dominion', edition: '1', icon: 'dom1e.png' },
                { id: 'base-2e', expansion: 'Dominion', edition: '2', icon: 'dom2e.png' },
            ];
            wikiClientSpy.fetchAllEditions.and.resolveTo(cargoEditions);
            editionBuilderSpy.build.withArgs(cargoEditions[0]).and.returnValue(editions[1]);
            editionBuilderSpy.build.withArgs(cargoEditions[1]).and.returnValue(editions[0]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/editions.json`,
                JSON.stringify(editions),
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(editionValidatorSpy.validate).toHaveBeenCalledWith(editions[0]);
            expect(editionValidatorSpy.validate).toHaveBeenCalledWith(editions[1]);
            /* eslint-enable */
        });

        it('should generate edition translations', async () => {
            const cargoEditions: CargoEdition[] = [
                {
                    Id: 'base-1e',
                    PageId: '1',
                    Expansion: 'Dominion',
                    Edition: '1',
                    Icon: 'dom1e.png',
                },
                {
                    Id: 'intrigue-1e',
                    PageId: '2',
                    Expansion: 'Intrigue',
                    Edition: '1',
                    Icon: 'intr1e.png',
                },
            ];
            const expansionPages: ExpansionPage[] = [
                { pageid: 1, title: 'Dominion' } as ExpansionPage,
                { pageid: 2, title: 'Intrigue' } as ExpansionPage,
            ];
            const dominionTranslations = new Map<string, EditionTranslation[]>([
                ['German', [{ id: 'base-1e', expansion: 'Dominion' }]],
                ['French', [{ id: 'base-1e', expansion: 'Dominion' }]],
            ]);
            const intrigueTranslations = new Map<string, EditionTranslation[]>([
                ['German', [{ id: 'intrigue-1e', expansion: 'Die Intrige' }]],
                ['French', [{ id: 'intrigue-1e', expansion: "L'Intrigue" }]],
            ]);
            const germanTranslations: EditionTranslation[] = [
                { id: 'base-1e', expansion: 'Dominion' },
                { id: 'intrigue-1e', expansion: 'Die Intrige' },
            ];
            const frenchTranslations: EditionTranslation[] = [
                { id: 'base-1e', expansion: 'Dominion' },
                { id: 'intrigue-1e', expansion: "L'Intrigue" },
            ];
            wikiClientSpy.fetchAllEditions.and.resolveTo(cargoEditions);
            wikiClientSpy.fetchAllExpansionPages.and.resolveTo(expansionPages);
            editionTranslationBuilderSpy.build
                .withArgs(expansionPages[0], [cargoEditions[0]])
                .and.returnValue(dominionTranslations);
            editionTranslationBuilderSpy.build
                .withArgs(expansionPages[1], [cargoEditions[1]])
                .and.returnValue(intrigueTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/editions.german.json`,
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/editions.french.json`,
                JSON.stringify(frenchTranslations),
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(editionTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[0],
                'German',
                cargoEditions[0],
            );
            expect(editionTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[1],
                'German',
                cargoEditions[1],
            );
            expect(editionTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[0],
                'French',
                cargoEditions[0],
            );
            expect(editionTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[1],
                'French',
                cargoEditions[1],
            );
            /* eslint-enable */
        });

        it('should generate card types', async () => {
            const cargoCardTypes: CargoCardType[] = [
                { Id: 'treasure', Name: 'Treasure', Scope: 'Basic' },
                { Id: 'action', Name: 'Action', Scope: 'Basic' },
            ];
            const cardTypes: CardType[] = [
                { id: 'action', name: 'Action', scope: 'Basic' },
                { id: 'treasure', name: 'Treasure', scope: 'Basic' },
            ];
            wikiClientSpy.fetchAllCardTypes.and.resolveTo(cargoCardTypes);
            cardTypeBuilderSpy.build.withArgs(cargoCardTypes[0]).and.returnValue(cardTypes[1]);
            cardTypeBuilderSpy.build.withArgs(cargoCardTypes[1]).and.returnValue(cardTypes[0]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/card-types.json`,
                JSON.stringify(cardTypes),
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(cardTypeValidatorSpy.validateFromCargo).toHaveBeenCalledWith(cardTypes[0]);
            expect(cardTypeValidatorSpy.validateFromCargo).toHaveBeenCalledWith(cardTypes[1]);
            /* eslint-enable */
        });

        it('should generate card type translations', async () => {
            const cargoCardTypes: CargoCardType[] = [
                { Id: 'action', Name: 'Action', Scope: 'Basic' },
                { Id: 'treasure', Name: 'Treasure', Scope: 'Basic' },
            ];
            const cardTypePages: CardTypePage[] = [
                { pageid: 216, title: 'Action' } as CardTypePage,
                { pageid: 220, title: 'Treasure' } as CardTypePage,
            ];
            const actionTranslations = new Map<string, CardTypeTranslation>([
                ['German', { id: 'action', name: 'Aktion' }],
                ['French', { id: 'action', name: 'Action' }],
            ]);
            const treasureTranslations = new Map<string, CardTypeTranslation>([
                ['German', { id: 'treasure', name: 'Geld' }],
                ['French', { id: 'treasure', name: 'Trésor' }],
            ]);
            const germanTranslations: CardTypeTranslation[] = [
                { id: 'action', name: 'Aktion' },
                { id: 'treasure', name: 'Geld' },
            ];
            const frenchTranslations: CardTypeTranslation[] = [
                { id: 'action', name: 'Action' },
                { id: 'treasure', name: 'Trésor' },
            ];
            wikiClientSpy.fetchAllCardTypes.and.resolveTo(cargoCardTypes);
            wikiClientSpy.fetchAllCardTypePages.and.resolveTo(cardTypePages);
            cardTypeTranslationBuilderSpy.build
                .withArgs(cardTypePages[0], cargoCardTypes[0])
                .and.returnValue(actionTranslations);
            cardTypeTranslationBuilderSpy.build
                .withArgs(cardTypePages[1], cargoCardTypes[1])
                .and.returnValue(treasureTranslations);

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
            expect(cardTypeTranslationValidatorSpy.validateFromCargo).toHaveBeenCalledWith(
                germanTranslations[0],
                'German',
                cargoCardTypes[0],
            );
            expect(cardTypeTranslationValidatorSpy.validateFromCargo).toHaveBeenCalledWith(
                germanTranslations[1],
                'German',
                cargoCardTypes[1],
            );
            expect(cardTypeTranslationValidatorSpy.validateFromCargo).toHaveBeenCalledWith(
                frenchTranslations[0],
                'French',
                cargoCardTypes[0],
            );
            expect(cardTypeTranslationValidatorSpy.validateFromCargo).toHaveBeenCalledWith(
                frenchTranslations[1],
                'French',
                cargoCardTypes[1],
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
            const cargoCardTypes: CargoCardType[] = [
                { Id: 'action', Name: 'Action', Scope: 'Basic' },
            ];
            const cardTypes: CardType[] = [{ id: 'action', name: 'Action', scope: 'Basic' }];
            const cargoEditions: CargoEdition[] = [
                {
                    Id: 'base-2e',
                    PageId: '1',
                    Expansion: 'Dominion',
                    Edition: '2',
                    Icon: 'dom2e.png',
                },
            ];
            const editions: Edition[] = [
                { id: 'base-2e', expansion: 'Dominion', edition: '2', icon: 'dom2e.png' },
            ];
            const cardPages: CardPage[] = [
                { pageid: 300, title: 'Cellar' } as CardPage,
                { pageid: 400, title: 'Village' } as CardPage,
            ];
            const cargoCards: CargoCard[] = [
                { Id: 'village', PageId: '400', Name: 'Village' } as CargoCard,
                { Id: 'cellar', PageId: '300', Name: 'Cellar' } as CargoCard,
            ];
            const cards: CardDto[] = [
                { id: 'cellar', name: 'Cellar' } as CardDto,
                { id: 'village', name: 'Village' } as CardDto,
            ];
            wikiClientSpy.fetchAllEditions.and.resolveTo(cargoEditions);
            wikiClientSpy.fetchAllCardTypes.and.resolveTo(cargoCardTypes);
            wikiClientSpy.fetchAllCards.and.resolveTo(cargoCards);
            wikiClientSpy.fetchAllCardPages.and.resolveTo(cardPages);
            editionBuilderSpy.build.withArgs(cargoEditions[0]).and.returnValue(editions[0]);
            cardTypeBuilderSpy.build.withArgs(cargoCardTypes[0]).and.returnValue(cardTypes[0]);
            cardDtoBuilderSpy.build
                .withArgs(cargoCards[0], cardPages[1], editions, cardTypes)
                .and.returnValue(cards[1]);
            cardDtoBuilderSpy.build
                .withArgs(cargoCards[1], cardPages[0], editions, cardTypes)
                .and.returnValue(cards[0]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/cards.json`,
                JSON.stringify(cards),
            );
            /* eslint-disable @typescript-eslint/unbound-method */
            expect(cardDtoValidatorSpy.validateFromCargo).toHaveBeenCalledWith(cards[0]);
            expect(cardDtoValidatorSpy.validateFromCargo).toHaveBeenCalledWith(cards[1]);
            expect(wikiClientSpy.fetchAllCardSymbolPages).toHaveBeenCalledBefore(
                cardDtoValidatorSpy.validateFromCargo,
            );
            expect(wikiClientSpy.fetchAllCardArtPages).toHaveBeenCalledBefore(
                cardDtoValidatorSpy.validateFromCargo,
            );
            /* eslint-enable */
        });

        it('should generate card translations', async () => {
            const cardPages: CardPage[] = [
                { pageid: 400, title: 'Village' } as CardPage,
                { pageid: 300, title: 'Cellar' } as CardPage,
            ];
            const cargoCards: CargoCard[] = [
                { Id: 'village', PageId: '400', Name: 'Village' } as CargoCard,
                { Id: 'cellar', PageId: '300', Name: 'Cellar' } as CargoCard,
            ];
            const cellarTranslations = new Map<string, CardTranslation>([
                ['German', { id: 'cellar', name: 'Keller', description: '' }],
                ['French', { id: 'cellar', name: 'Cave', description: '' }],
            ]);
            const villageTranslations = new Map<string, CardTranslation>([
                ['German', { id: 'village', name: 'Dorf', description: '' }],
                ['French', { id: 'village', name: 'Village', description: '' }],
            ]);
            const germanTranslations: CardTranslation[] = [
                { id: 'cellar', name: 'Keller', description: '' },
                { id: 'village', name: 'Dorf', description: '' },
            ];
            const frenchTranslations: CardTranslation[] = [
                { id: 'cellar', name: 'Cave', description: '' },
                { id: 'village', name: 'Village', description: '' },
            ];
            wikiClientSpy.fetchAllCards.and.resolveTo(cargoCards);
            wikiClientSpy.fetchAllCardPages.and.resolveTo(cardPages);
            cardTranslationBuilderSpy.build
                .withArgs(cardPages[1], cargoCards[1])
                .and.returnValue(cellarTranslations);
            cardTranslationBuilderSpy.build
                .withArgs(cardPages[0], cargoCards[0])
                .and.returnValue(villageTranslations);

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
            expect(cardTranslationValidatorSpy.validateFromCargo).toHaveBeenCalledWith(
                germanTranslations[0],
                'German',
                cargoCards[1],
            );
            expect(cardTranslationValidatorSpy.validateFromCargo).toHaveBeenCalledWith(
                germanTranslations[1],
                'German',
                cargoCards[0],
            );
            expect(cardTranslationValidatorSpy.validateFromCargo).toHaveBeenCalledWith(
                frenchTranslations[0],
                'French',
                cargoCards[1],
            );
            expect(cardTranslationValidatorSpy.validateFromCargo).toHaveBeenCalledWith(
                frenchTranslations[1],
                'French',
                cargoCards[0],
            );
            /* eslint-enable */
        });

        it('with validation failure should return false', async () => {
            editionValidatorSpy.validate.and.returnValue(
                ValidationResult.Failure('Edition validation failed'),
            );
            wikiClientSpy.fetchAllEditions.and.resolveTo([
                {
                    Id: 'base-1e',
                    PageId: '1',
                    Expansion: 'Dominion',
                    Edition: '1',
                    Icon: 'dom1e.png',
                },
            ]);
            editionBuilderSpy.build.and.returnValue({
                id: 'base-1e',
                expansion: 'Dominion',
                edition: '1',
                icon: 'dom1e.png',
            });

            const result = await dominionizerWikiBot.generateAll();

            expect(result).toBe(false);
        });

        it('without validation errors should return true', async () => {
            const result = await dominionizerWikiBot.generateAll();

            expect(result).toBe(true);
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
