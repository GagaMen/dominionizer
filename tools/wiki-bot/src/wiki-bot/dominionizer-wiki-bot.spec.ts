import { createSpyObj, SpyObj } from '../testing/spy-obj';
import { when } from 'vitest-when';
import type { Mock } from 'vitest';
import { CardTranslationValidator } from './validation/card-translation-validators';
import { ImagesValidator } from './validation/image-validators';
import { CardTypeTranslationValidator } from './validation/card-type-translation-validators';
import { EditionTranslationValidator } from './validation/edition-translation-validators';
import { EditionValidator } from './validation/edition-validators';
import { CardDtosValidator, CardDtoValidator } from './validation/card-dto-validators';
import { CardTypesValidator, CardTypeValidator } from './validation/card-type-validators';
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
import { CargoIdUniquenessValidator } from './validation/cargo-id-uniqueness-validator';
import { TranslationPresenceValidator } from './validation/translation-presence-validator';

describe('DominionizerWikiBot', () => {
    let dominionizerWikiBot: DominionizerWikiBot;
    let lastGenerationTime: Date;
    let currentGenerationTime: Date;
    let targetPath: string;
    let wikiClientSpy: SpyObj<WikiClient>;
    let editionBuilderSpy: SpyObj<EditionBuilder>;
    let editionTranslationBuilderSpy: SpyObj<EditionTranslationBuilder>;
    let cardTypeBuilderSpy: SpyObj<CardTypeBuilder>;
    let cardTypeTranslationBuilderSpy: SpyObj<CardTypeTranslationBuilder>;
    let cardDtoBuilderSpy: SpyObj<CardDtoBuilder>;
    let cardTranslationBuilderSpy: SpyObj<CardTranslationBuilder>;
    let imageBuilderSpy: SpyObj<ImageBuilder>;
    let editionValidatorSpy: SpyObj<EditionValidator>;
    let editionTranslationValidatorSpy: SpyObj<EditionTranslationValidator>;
    let cardTypeValidatorSpy: SpyObj<CardTypeValidator>;
    let cardTypesValidatorSpy: SpyObj<CardTypesValidator>;
    let cardTypeTranslationValidatorSpy: SpyObj<CardTypeTranslationValidator>;
    let cardDtoValidatorSpy: SpyObj<CardDtoValidator>;
    let cardDtosValidatorSpy: SpyObj<CardDtosValidator>;
    let cardTranslationValidatorSpy: SpyObj<CardTranslationValidator>;
    let imagesValidatorSpy: SpyObj<ImagesValidator>;
    let cargoIdUniquenessValidatorSpy: SpyObj<CargoIdUniquenessValidator>;
    let translationPresenceValidatorSpy: SpyObj<TranslationPresenceValidator>;
    let writeFileSpy: Mock;
    let readFileSpy: Mock;

    beforeEach(() => {
        lastGenerationTime = new Date('2022-09-03T09:18:53.321Z');
        currentGenerationTime = new Date();

        targetPath = '.';

        wikiClientSpy = createSpyObj<WikiClient>({
            fetchAllEditions: vi.fn(),
            fetchAllCardTypes: vi.fn(),
            fetchAllCards: vi.fn(),
            fetchAllExpansionPages: vi.fn(),
            fetchAllCardTypePages: vi.fn(),
            fetchAllCardPages: vi.fn(),
            fetchAllCardSymbolPages: vi.fn(),
            fetchAllCardArtPages: vi.fn(),
            fetchRecentImageChanges: vi.fn(),
        });
        wikiClientSpy.fetchAllEditions.mockResolvedValue([]);
        wikiClientSpy.fetchAllCardTypes.mockResolvedValue([]);
        wikiClientSpy.fetchAllCards.mockResolvedValue([]);
        wikiClientSpy.fetchAllExpansionPages.mockResolvedValue([]);
        wikiClientSpy.fetchAllCardTypePages.mockResolvedValue([]);
        wikiClientSpy.fetchAllCardPages.mockResolvedValue([]);
        wikiClientSpy.fetchAllCardSymbolPages.mockResolvedValue([]);
        wikiClientSpy.fetchAllCardArtPages.mockResolvedValue([]);
        wikiClientSpy.fetchRecentImageChanges.mockResolvedValue([]);

        editionBuilderSpy = createSpyObj<EditionBuilder>({
            build: vi.fn(),
        });
        editionBuilderSpy.build.mockReturnValue({ id: '' } as unknown as Edition);

        editionTranslationBuilderSpy = createSpyObj<EditionTranslationBuilder>({
            build: vi.fn(),
        });
        editionTranslationBuilderSpy.build.mockReturnValue(new Map());

        cardTypeBuilderSpy = createSpyObj<CardTypeBuilder>({
            build: vi.fn(),
        });
        cardTypeBuilderSpy.build.mockReturnValue({ id: '' } as unknown as CardType);

        cardTypeTranslationBuilderSpy = createSpyObj<CardTypeTranslationBuilder>({
            build: vi.fn(),
        });
        cardTypeTranslationBuilderSpy.build.mockReturnValue(new Map());

        cardDtoBuilderSpy = createSpyObj<CardDtoBuilder>({
            build: vi.fn(),
        });
        cardDtoBuilderSpy.build.mockReturnValue({ id: '' } as unknown as CardDto);

        cardTranslationBuilderSpy = createSpyObj<CardTranslationBuilder>({
            build: vi.fn(),
        });
        cardTranslationBuilderSpy.build.mockReturnValue(new Map());

        imageBuilderSpy = createSpyObj<ImageBuilder>({
            build: vi.fn(),
        });

        editionValidatorSpy = createSpyObj<EditionValidator>({
            validate: vi.fn(),
        });
        editionValidatorSpy.validate.mockReturnValue(ValidationResult.Success);

        editionTranslationValidatorSpy = createSpyObj<EditionTranslationValidator>({
            validate: vi.fn(),
        });
        editionTranslationValidatorSpy.validate.mockReturnValue(ValidationResult.Success);

        cardTypeValidatorSpy = createSpyObj<CardTypeValidator>({
            validate: vi.fn(),
        });
        cardTypeValidatorSpy.validate.mockReturnValue(ValidationResult.Success);

        cardTypesValidatorSpy = createSpyObj<CardTypesValidator>({
            validate: vi.fn(),
        });
        cardTypesValidatorSpy.validate.mockReturnValue(ValidationResult.Success);

        cardTypeTranslationValidatorSpy = createSpyObj<CardTypeTranslationValidator>({
            validate: vi.fn(),
        });
        cardTypeTranslationValidatorSpy.validate.mockReturnValue(ValidationResult.Success);

        cardDtoValidatorSpy = createSpyObj<CardDtoValidator>({
            validate: vi.fn(),
        });
        cardDtoValidatorSpy.validate.mockReturnValue(ValidationResult.Success);

        cardDtosValidatorSpy = createSpyObj<CardDtosValidator>({
            validate: vi.fn(),
        });
        cardDtosValidatorSpy.validate.mockReturnValue(ValidationResult.Success);

        cardTranslationValidatorSpy = createSpyObj<CardTranslationValidator>({
            validate: vi.fn(),
        });
        cardTranslationValidatorSpy.validate.mockReturnValue(ValidationResult.Success);

        imagesValidatorSpy = createSpyObj<ImagesValidator>({
            validate: vi.fn(),
        });
        imagesValidatorSpy.validate.mockReturnValue(ValidationResult.Success);

        cargoIdUniquenessValidatorSpy = createSpyObj<CargoIdUniquenessValidator>({
            validate: vi.fn(),
        });
        cargoIdUniquenessValidatorSpy.validate.mockReturnValue(ValidationResult.Success);

        translationPresenceValidatorSpy = createSpyObj<TranslationPresenceValidator>({
            validate: vi.fn(),
        });
        translationPresenceValidatorSpy.validate.mockReturnValue(ValidationResult.Success);

        writeFileSpy = vi.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined);

        readFileSpy = vi.spyOn(fs.promises, 'readFile').mockResolvedValue('');
        when(readFileSpy)
            .calledWith('./last-generation.json', 'utf8')
            .thenResolve(JSON.stringify(lastGenerationTime));

        vi.spyOn(console, 'log').mockReturnValue(undefined);
        vi.spyOn(console, 'warn').mockReturnValue(undefined);
        vi.spyOn(console, 'error').mockReturnValue(undefined);

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
            cardTypesValidatorSpy,
            cardTypeTranslationValidatorSpy,
            cardDtoValidatorSpy,
            cardDtosValidatorSpy,
            cardTranslationValidatorSpy,
            imagesValidatorSpy,
            cargoIdUniquenessValidatorSpy,
            translationPresenceValidatorSpy,
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
                    PageId: '1',
                    Expansion: 'Dominion',
                    Edition: '2',
                    Icon: 'dom2e.png',
                },
                {
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
            wikiClientSpy.fetchAllEditions.mockResolvedValue(cargoEditions);
            when(editionBuilderSpy.build).calledWith(cargoEditions[0]).thenReturn(editions[1]);
            when(editionBuilderSpy.build).calledWith(cargoEditions[1]).thenReturn(editions[0]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/editions.json`,
                JSON.stringify(editions),
            );

            expect(editionValidatorSpy.validate).toHaveBeenCalledWith(editions[0]);
            expect(editionValidatorSpy.validate).toHaveBeenCalledWith(editions[1]);
        });

        it('should generate edition translations', async () => {
            const cargoEditions: CargoEdition[] = [
                {
                    PageId: '1',
                    Expansion: 'Dominion',
                    Edition: '1',
                    Icon: 'dom1e.png',
                },
                {
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
                ['German', [{ id: '1-1', expansion: 'Dominion' }]],
                ['French', [{ id: '1-1', expansion: 'Dominion' }]],
            ]);
            const intrigueTranslations = new Map<string, EditionTranslation[]>([
                ['German', [{ id: '2-1', expansion: 'Die Intrige' }]],
                ['French', [{ id: '2-1', expansion: "L'Intrigue" }]],
            ]);
            const germanTranslations: EditionTranslation[] = [
                { id: '1-1', expansion: 'Dominion' },
                { id: '2-1', expansion: 'Die Intrige' },
            ];
            const frenchTranslations: EditionTranslation[] = [
                { id: '1-1', expansion: 'Dominion' },
                { id: '2-1', expansion: "L'Intrigue" },
            ];
            wikiClientSpy.fetchAllEditions.mockResolvedValue(cargoEditions);
            wikiClientSpy.fetchAllExpansionPages.mockResolvedValue(expansionPages);
            when(editionTranslationBuilderSpy.build)
                .calledWith(expansionPages[0], [cargoEditions[0]])
                .thenReturn(dominionTranslations);
            when(editionTranslationBuilderSpy.build)
                .calledWith(expansionPages[1], [cargoEditions[1]])
                .thenReturn(intrigueTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/editions.german.json`,
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/editions.french.json`,
                JSON.stringify(frenchTranslations),
            );

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
        });

        it('should generate card types', async () => {
            const cargoCardTypes: CargoCardType[] = [
                { PageId: '220', Name: 'Treasure', Scope: 'Basic' },
                { PageId: '216', Name: 'Action', Scope: 'Basic' },
            ];
            const cardTypes: CardType[] = [
                { id: 'action', name: 'Action', scope: 'Basic' },
                { id: 'treasure', name: 'Treasure', scope: 'Basic' },
            ];
            wikiClientSpy.fetchAllCardTypes.mockResolvedValue(cargoCardTypes);
            when(cardTypeBuilderSpy.build).calledWith(cargoCardTypes[0]).thenReturn(cardTypes[1]);
            when(cardTypeBuilderSpy.build).calledWith(cargoCardTypes[1]).thenReturn(cardTypes[0]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/card-types.json`,
                JSON.stringify(cardTypes),
            );

            expect(cardTypeValidatorSpy.validate).toHaveBeenCalledWith(cardTypes[0]);
            expect(cardTypeValidatorSpy.validate).toHaveBeenCalledWith(cardTypes[1]);
            expect(cardTypesValidatorSpy.validate).toHaveBeenCalledWith(cardTypes, cargoCardTypes);
        });

        it('should generate card type translations', async () => {
            const cargoCardTypes: CargoCardType[] = [
                { PageId: '216', Name: 'Action', Scope: 'Basic' },
                { PageId: '220', Name: 'Treasure', Scope: 'Basic' },
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
            wikiClientSpy.fetchAllCardTypes.mockResolvedValue(cargoCardTypes);
            wikiClientSpy.fetchAllCardTypePages.mockResolvedValue(cardTypePages);
            when(cardTypeTranslationBuilderSpy.build)
                .calledWith(cardTypePages[0], cargoCardTypes[0])
                .thenReturn(actionTranslations);
            when(cardTypeTranslationBuilderSpy.build)
                .calledWith(cardTypePages[1], cargoCardTypes[1])
                .thenReturn(treasureTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/card-types.german.json`,
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/card-types.french.json`,
                JSON.stringify(frenchTranslations),
            );

            expect(cardTypeTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[0],
                'German',
                cargoCardTypes[0],
            );
            expect(cardTypeTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[1],
                'German',
                cargoCardTypes[1],
            );
            expect(cardTypeTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[0],
                'French',
                cargoCardTypes[0],
            );
            expect(cardTypeTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[1],
                'French',
                cargoCardTypes[1],
            );
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
            wikiClientSpy.fetchAllCardSymbolPages.mockResolvedValue(cardSymbolPages);
            when(imageBuilderSpy.build)
                .calledWith(cardSymbolPages[0])
                .thenResolve(firstEncodedImage);
            when(imageBuilderSpy.build)
                .calledWith(cardSymbolPages[1])
                .thenResolve(secondEncodedImage);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_symbols/${firstEncodedImage.fileName}`,
                firstEncodedImage.data,
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_symbols/${secondEncodedImage.fileName}`,
                secondEncodedImage.data,
            );

            expect(imagesValidatorSpy.validate).toHaveBeenCalledWith(
                [firstEncodedImage, secondEncodedImage],
                cardSymbolPages,
            );
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
            wikiClientSpy.fetchAllCardArtPages.mockResolvedValue(cardArtPages);
            when(imageBuilderSpy.build).calledWith(cardArtPages[0]).thenResolve(firstEncodedImage);
            when(imageBuilderSpy.build).calledWith(cardArtPages[1]).thenResolve(secondEncodedImage);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_art/${firstEncodedImage.fileName}`,
                firstEncodedImage.data,
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_art/${secondEncodedImage.fileName}`,
                secondEncodedImage.data,
            );

            expect(imagesValidatorSpy.validate).toHaveBeenCalledWith(
                [firstEncodedImage, secondEncodedImage],
                cardArtPages,
            );
        });

        it('with skipImages is true should not generate images', async () => {
            await dominionizerWikiBot.generateAll(true);

            expect(wikiClientSpy.fetchAllCardSymbolPages).not.toHaveBeenCalled();
            expect(wikiClientSpy.fetchAllCardArtPages).not.toHaveBeenCalled();
            expect(imageBuilderSpy.build).not.toHaveBeenCalled();
        });

        it('should generate cards', async () => {
            const cargoCardTypes: CargoCardType[] = [
                { PageId: '216', Name: 'Action', Scope: 'Basic' },
            ];
            const cardTypes: CardType[] = [{ id: 'action', name: 'Action', scope: 'Basic' }];
            const cargoEditions: CargoEdition[] = [
                {
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
                { PageId: '400', Name: 'Village' } as CargoCard,
                { PageId: '300', Name: 'Cellar' } as CargoCard,
            ];
            const cards: CardDto[] = [
                { id: 'cellar', name: 'Cellar' } as CardDto,
                { id: 'village', name: 'Village' } as CardDto,
            ];
            wikiClientSpy.fetchAllEditions.mockResolvedValue(cargoEditions);
            wikiClientSpy.fetchAllCardTypes.mockResolvedValue(cargoCardTypes);
            wikiClientSpy.fetchAllCards.mockResolvedValue(cargoCards);
            wikiClientSpy.fetchAllCardPages.mockResolvedValue(cardPages);
            when(editionBuilderSpy.build).calledWith(cargoEditions[0]).thenReturn(editions[0]);
            when(cardTypeBuilderSpy.build).calledWith(cargoCardTypes[0]).thenReturn(cardTypes[0]);
            when(cardDtoBuilderSpy.build)
                .calledWith(cargoCards[0], cardPages[1], editions, cardTypes)
                .thenReturn(cards[1]);
            when(cardDtoBuilderSpy.build)
                .calledWith(cargoCards[1], cardPages[0], editions, cardTypes)
                .thenReturn(cards[0]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/cards.json`,
                JSON.stringify(cards),
            );

            expect(cardDtoValidatorSpy.validate).toHaveBeenCalledWith(cards[0]);
            expect(cardDtoValidatorSpy.validate).toHaveBeenCalledWith(cards[1]);
            expect(cardDtosValidatorSpy.validate).toHaveBeenCalledWith(cards, cargoCards);
            expect(
                Math.min(
                    ...vi.mocked(wikiClientSpy.fetchAllCardSymbolPages).mock.invocationCallOrder,
                ),
            ).toBeLessThan(
                Math.min(...vi.mocked(cardDtoValidatorSpy.validate).mock.invocationCallOrder),
            );
            expect(
                Math.min(...vi.mocked(wikiClientSpy.fetchAllCardArtPages).mock.invocationCallOrder),
            ).toBeLessThan(
                Math.min(...vi.mocked(cardDtoValidatorSpy.validate).mock.invocationCallOrder),
            );
        });

        it('should generate card translations', async () => {
            const cardPages: CardPage[] = [
                { pageid: 400, title: 'Village' } as CardPage,
                { pageid: 300, title: 'Cellar' } as CardPage,
            ];
            const cargoCards: CargoCard[] = [
                { PageId: '400', Name: 'Village' } as CargoCard,
                { PageId: '300', Name: 'Cellar' } as CargoCard,
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
            wikiClientSpy.fetchAllCards.mockResolvedValue(cargoCards);
            wikiClientSpy.fetchAllCardPages.mockResolvedValue(cardPages);
            when(cardTranslationBuilderSpy.build)
                .calledWith(cardPages[1], cargoCards[1])
                .thenReturn(cellarTranslations);
            when(cardTranslationBuilderSpy.build)
                .calledWith(cardPages[0], cargoCards[0])
                .thenReturn(villageTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/cards.german.json`,
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/cards.french.json`,
                JSON.stringify(frenchTranslations),
            );

            expect(cardTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[0],
                'German',
                cargoCards[1],
            );
            expect(cardTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                germanTranslations[1],
                'German',
                cargoCards[0],
            );
            expect(cardTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[0],
                'French',
                cargoCards[1],
            );
            expect(cardTranslationValidatorSpy.validate).toHaveBeenCalledWith(
                frenchTranslations[1],
                'French',
                cargoCards[0],
            );
        });

        it('with validation failure should return false', async () => {
            editionValidatorSpy.validate.mockReturnValue(
                ValidationResult.Failure('Edition validation failed'),
            );
            wikiClientSpy.fetchAllEditions.mockResolvedValue([
                {
                    PageId: '1',
                    Expansion: 'Dominion',
                    Edition: '1',
                    Icon: 'dom1e.png',
                },
            ]);
            editionBuilderSpy.build.mockReturnValue({
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

        it('with warning level validation failure should return true and report it', async () => {
            cardDtosValidatorSpy.validate.mockReturnValue(
                ValidationResult.Failure('For following cargo cards no card was generated:\nReap'),
            );

            const result = await dominionizerWikiBot.generateAll();

            expect(result).toBe(true);
            expect(writeFileSpy).toHaveBeenCalledWith(
                './validation-report.md',
                '### ⚠️ Validation warnings (1)\n\n' +
                    '```\nFor following cargo cards no card was generated:\nReap\n```\n',
            );
        });

        it('with error level validation failure should return false and report it', async () => {
            cardTypesValidatorSpy.validate.mockReturnValue(
                ValidationResult.Failure('Card types validation failed'),
            );

            const result = await dominionizerWikiBot.generateAll();

            expect(result).toBe(false);
            expect(writeFileSpy).toHaveBeenCalledWith(
                './validation-report.md',
                '### ❌ Validation errors (1)\n\n```\nCard types validation failed\n```\n',
            );
        });

        it('without validation failures should write an empty validation report', async () => {
            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith('./validation-report.md', '');
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
            when(wikiClientSpy.fetchRecentImageChanges)
                .calledWith(lastGenerationTime)
                .thenResolve(changedImagePages);
            when(imageBuilderSpy.build)
                .calledWith(changedImagePages[0])
                .thenResolve(encodedCardSymbol);
            when(imageBuilderSpy.build)
                .calledWith(changedImagePages[1])
                .thenResolve(encodedCardArt);

            await dominionizerWikiBot.generateUpdate();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_symbols/${encodedCardSymbol.fileName}`,
                encodedCardSymbol.data,
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/assets/card_art/${encodedCardArt.fileName}`,
                encodedCardArt.data,
            );

            expect(imagesValidatorSpy.validate).toHaveBeenCalledWith(
                [encodedCardSymbol],
                [changedImagePages[0]],
            );
            expect(imagesValidatorSpy.validate).toHaveBeenCalledWith(
                [encodedCardArt],
                [changedImagePages[1]],
            );
        });

        it('with skipImages is true should not generate images', async () => {
            await dominionizerWikiBot.generateUpdate(true);

            expect(wikiClientSpy.fetchRecentImageChanges).not.toHaveBeenCalled();
            expect(imageBuilderSpy.build).not.toHaveBeenCalled();
        });

        it('should generate all without images', async () => {
            const generateAllSpy = vi
                .spyOn(dominionizerWikiBot, 'generateAll')
                .mockResolvedValue(true);

            await dominionizerWikiBot.generateUpdate();

            expect(generateAllSpy).toHaveBeenCalledWith(true);

            expect(
                Math.min(
                    ...vi.mocked(wikiClientSpy.fetchRecentImageChanges).mock.invocationCallOrder,
                ),
            ).toBeLessThan(Math.min(...vi.mocked(generateAllSpy).mock.invocationCallOrder));
            expect(
                Math.min(...vi.mocked(imagesValidatorSpy.validate).mock.invocationCallOrder),
            ).toBeLessThan(Math.min(...vi.mocked(generateAllSpy).mock.invocationCallOrder));
        });
    });
});
