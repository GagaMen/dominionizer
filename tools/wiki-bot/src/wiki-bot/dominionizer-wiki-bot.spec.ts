import { CardTypeTranslation } from './../../../../src/app/models/card-type';
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
import { ExpansionPage, CardPage, ImagePage, CardTypePage } from './wiki-client/api-models';
import { WikiClient } from './wiki-client/wiki-client';
import * as Fs from 'fs/promises';
import { CardType } from '../../../../src/app/models/card-type';

describe('DominionizerWikiBot', () => {
    let dominionizerWikiBot: DominionizerWikiBot;
    let targetPath: string;
    let wikiClientSpy: jasmine.SpyObj<WikiClient>;
    let expansionBuilderSpy: jasmine.SpyObj<ExpansionBuilder>;
    let expansionTranslationBuilderSpy: jasmine.SpyObj<ExpansionTranslationBuilder>;
    let cardTypeBuilderSpy: jasmine.SpyObj<CardTypeBuilder>;
    let cardTypeTranslationBuilderSpy: jasmine.SpyObj<CardTypeTranslationBuilder>;
    let expansionCardsMapBuilderSpy: jasmine.SpyObj<ExpansionCardsMapBuilder>;
    let cardDtoBuilderSpy: jasmine.SpyObj<CardDtoBuilder>;
    let cardTranslationBuilderSpy: jasmine.SpyObj<CardTranslationBuilder>;
    let imageBuilderSpy: jasmine.SpyObj<ImageBuilder>;
    let writeFileSpy: jasmine.Spy;

    beforeEach(() => {
        targetPath = './assets';

        wikiClientSpy = jasmine.createSpyObj<WikiClient>('WikiClient', [
            'fetchAllExpansionPages',
            'fetchAllCardTypePages',
            'fetchAllCardPages',
            'fetchAllCardSymbolPages',
            'fetchAllCardArtPages',
        ]);
        wikiClientSpy.fetchAllExpansionPages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardTypePages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardPages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardSymbolPages.and.resolveTo([]);
        wikiClientSpy.fetchAllCardArtPages.and.resolveTo([]);

        expansionBuilderSpy = jasmine.createSpyObj<ExpansionBuilder>('ExpansionBuilder', ['build']);

        expansionTranslationBuilderSpy = jasmine.createSpyObj<ExpansionTranslationBuilder>(
            'ExpansionTranslationBuilder',
            ['build'],
        );
        expansionTranslationBuilderSpy.build.and.returnValue(new Map());

        cardTypeBuilderSpy = jasmine.createSpyObj<CardTypeBuilder>('CardTypeBuilder', ['build']);

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

        cardTranslationBuilderSpy = jasmine.createSpyObj<CardTranslationBuilder>(
            'CardTranslationBuilder',
            ['build'],
        );
        cardTranslationBuilderSpy.build.and.returnValue(new Map());

        imageBuilderSpy = jasmine.createSpyObj<ImageBuilder>('ImageBuilder', ['build']);

        writeFileSpy = spyOn(Fs, 'writeFile');

        spyOn(console, 'log').and.stub();

        dominionizerWikiBot = new DominionizerWikiBot(
            targetPath,
            wikiClientSpy,
            expansionBuilderSpy,
            expansionTranslationBuilderSpy,
            cardTypeBuilderSpy,
            cardTypeTranslationBuilderSpy,
            expansionCardsMapBuilderSpy,
            cardDtoBuilderSpy,
            cardTranslationBuilderSpy,
            imageBuilderSpy,
        );
    });

    describe('generateAll', () => {
        // error handling for builders (log and continue)

        it('should generate expansions', async () => {
            const expansionPages: ExpansionPage[] = [
                { pageid: 1 } as ExpansionPage,
                { pageid: 2 } as ExpansionPage,
            ];
            const expansions: Expansion[] = [{ id: 1 } as Expansion, { id: 2 } as Expansion];
            wikiClientSpy.fetchAllExpansionPages.and.resolveTo(expansionPages);
            expansionBuilderSpy.build.withArgs(expansionPages[0]).and.returnValue([expansions[0]]);
            expansionBuilderSpy.build.withArgs(expansionPages[1]).and.returnValue([expansions[1]]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/expansions.json`,
                JSON.stringify(expansions),
            );
        });

        it('should generate expansion translations', async () => {
            const expansionPages: ExpansionPage[] = [
                { pageid: 1 } as ExpansionPage,
                { pageid: 2 } as ExpansionPage,
            ];
            const firstExpansionTranslations: Map<string, ExpansionTranslation> = new Map([
                ['German', { id: 1, name: 'german title' }],
                ['French', { id: 1, name: 'french title' }],
            ]);
            const secondExpansionTranslations: Map<string, ExpansionTranslation> = new Map([
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
                .and.returnValue(firstExpansionTranslations);
            expansionTranslationBuilderSpy.build
                .withArgs(expansionPages[1])
                .and.returnValue(secondExpansionTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/expansions.german.json`,
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/expansions.french.json`,
                JSON.stringify(frenchTranslations),
            );
        });

        it('should generate card types', async () => {
            const cardTypePages: CardTypePage[] = [
                { pageid: 1000 } as CardTypePage,
                { pageid: 2000 } as CardTypePage,
            ];
            const cardTypes: CardType[] = [
                { id: 1000, name: 'Card Type 1' },
                { id: 2000, name: 'Card Type 2' },
            ];
            wikiClientSpy.fetchAllCardTypePages.and.resolveTo(cardTypePages);
            cardTypeBuilderSpy.build.withArgs(cardTypePages[0]).and.returnValue(cardTypes[0]);
            cardTypeBuilderSpy.build.withArgs(cardTypePages[1]).and.returnValue(cardTypes[1]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/card-types.json`,
                JSON.stringify(cardTypes),
            );
        });

        it('should generate card type translations', async () => {
            const cardTypePages: CardTypePage[] = [
                { pageid: 1000 } as CardTypePage,
                { pageid: 2000 } as CardTypePage,
            ];
            const firstCardTypeTranslations: Map<string, CardTypeTranslation> = new Map([
                ['German', { id: 1, name: 'german title' }],
                ['French', { id: 1, name: 'french title' }],
            ]);
            const secondCardTypeTranslations: Map<string, CardTypeTranslation> = new Map([
                ['German', { id: 2, name: 'german title' }],
                ['French', { id: 2, name: 'french title' }],
            ]);
            const germanTranslations: CardTypeTranslation[] = [
                { id: 1, name: 'german title' },
                { id: 2, name: 'german title' },
            ];
            const frenchTranslations: CardTypeTranslation[] = [
                { id: 1, name: 'french title' },
                { id: 2, name: 'french title' },
            ];
            wikiClientSpy.fetchAllCardTypePages.and.resolveTo(cardTypePages);
            cardTypeTranslationBuilderSpy.build
                .withArgs(cardTypePages[0])
                .and.returnValue(firstCardTypeTranslations);
            cardTypeTranslationBuilderSpy.build
                .withArgs(cardTypePages[1])
                .and.returnValue(secondCardTypeTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/card-types.german.json`,
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/card-types.french.json`,
                JSON.stringify(frenchTranslations),
            );
        });

        it('should generate cards', async () => {
            const expansionPages: ExpansionPage[] = [
                { pageid: 1 } as ExpansionPage,
                { pageid: 2 } as ExpansionPage,
            ];
            const expansionCardsMap: Map<number, string[]> = new Map([
                [1, ['Card 10', 'Card 20']],
                [2, ['Card 20']],
            ]);
            const cardTypePages: CardTypePage[] = [
                { pageid: 1000 } as CardTypePage,
                { pageid: 2000 } as CardTypePage,
            ];
            const cardTypes: CardType[] = [{ id: 1000 } as CardType, { id: 2000 } as CardType];
            const cardPages: CardPage[] = [
                { pageid: 10, title: 'Card 10' } as CardPage,
                { pageid: 20, title: 'Card 20' } as CardPage,
            ];
            const cardExpansionsMap: Map<string, number[]> = new Map([
                ['Card 10', [1]],
                ['Card 20', [1, 2]],
                ['Card 1000', [1]],
            ]);
            const cards: CardDto[] = [
                { id: 10, name: 'Card 10', expansions: [1] } as CardDto,
                { id: 20, name: 'Card 20', expansions: [1, 2] } as CardDto,
                { id: 1000, name: 'Card 1000', expansions: [1] } as CardDto,
            ];
            wikiClientSpy.fetchAllExpansionPages.and.resolveTo(expansionPages);
            wikiClientSpy.fetchAllCardPages.and.resolveTo(cardPages);
            wikiClientSpy.fetchAllCardTypePages.and.resolveTo(cardTypePages);
            cardTypeBuilderSpy.build.withArgs(cardTypePages[0]).and.returnValue(cardTypes[0]);
            cardTypeBuilderSpy.build.withArgs(cardTypePages[1]).and.returnValue(cardTypes[1]);
            expansionCardsMapBuilderSpy.buildWithExpansionPage
                .withArgs(expansionPages[0])
                .and.returnValue(new Map([[1, ['Card 10', 'Card 20']]]));
            expansionCardsMapBuilderSpy.buildWithExpansionPage
                .withArgs(expansionPages[1])
                .and.returnValue(new Map([[2, ['Card 20']]]));
            expansionCardsMapBuilderSpy.buildWithCardTypePage
                .withArgs(cardTypePages[0], expansionCardsMap)
                .and.returnValue(new Map([[1, ['Card 1000']]]));
            expansionCardsMapBuilderSpy.buildWithCardTypePage
                .withArgs(cardTypePages[1], expansionCardsMap)
                .and.returnValue(new Map());
            cardDtoBuilderSpy.build
                .withArgs(cardPages[0], cardExpansionsMap, cardTypes)
                .and.returnValue(cards[0]);
            cardDtoBuilderSpy.build
                .withArgs(cardPages[1], cardExpansionsMap, cardTypes)
                .and.returnValue(cards[1]);
            cardDtoBuilderSpy.build
                .withArgs(cardTypePages[0], cardExpansionsMap, cardTypes)
                .and.returnValue(cards[2]);
            cardDtoBuilderSpy.build
                .withArgs(cardTypePages[1], cardExpansionsMap, cardTypes)
                .and.returnValue(null);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/cards.json`,
                JSON.stringify(cards),
            );
        });

        it('should generate card translations', async () => {
            const cardPages: CardPage[] = [{ pageid: 10 } as CardPage, { pageid: 20 } as CardPage];
            const cards: CardDto[] = [{ id: 10 } as CardDto, { id: 20 } as CardDto];
            const firstCardTranslations: Map<string, CardTranslation> = new Map([
                ['German', { id: 10, name: 'german title' } as CardTranslation],
                ['French', { id: 10, name: 'french title' } as CardTranslation],
            ]);
            const secondCardTranslations: Map<string, CardTranslation> = new Map([
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
                .and.returnValue(cards[0]);
            cardDtoBuilderSpy.build
                .withArgs(cardPages[1], jasmine.anything(), jasmine.anything())
                .and.returnValue(cards[1]);
            cardTranslationBuilderSpy.build
                .withArgs(cardPages[0], cards[0])
                .and.returnValue(firstCardTranslations);
            cardTranslationBuilderSpy.build
                .withArgs(cardPages[1], cards[1])
                .and.returnValue(secondCardTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/cards.german.json`,
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/data/cards.french.json`,
                JSON.stringify(frenchTranslations),
            );
        });

        it('should generate card symbols', async () => {
            const cardSymbolPages: ImagePage[] = [
                { pageid: 100, title: 'File:First.png' } as ImagePage,
                { pageid: 200, title: 'File:Second.png' } as ImagePage,
            ];
            const firstEncodedImage: EncodedImage = {
                fileName: 'First.png',
                data: new Uint8Array([1, 2]),
            };
            const secondEncodedImage: EncodedImage = {
                fileName: 'Second.png',
                data: new Uint8Array([3, 4]),
            };
            wikiClientSpy.fetchAllCardSymbolPages.and.resolveTo(cardSymbolPages);
            imageBuilderSpy.build.withArgs(cardSymbolPages[0]).and.resolveTo(firstEncodedImage);
            imageBuilderSpy.build.withArgs(cardSymbolPages[1]).and.resolveTo(secondEncodedImage);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/card_symbols/${firstEncodedImage.fileName}`,
                firstEncodedImage.data,
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/card_symbols/${secondEncodedImage.fileName}`,
                secondEncodedImage.data,
            );
        });

        it('should generate card arts', async () => {
            const cardArtPages: ImagePage[] = [
                { pageid: 101, title: 'File:First.jpg' } as ImagePage,
                { pageid: 201, title: 'File:Second.jpg' } as ImagePage,
            ];
            const firstEncodedImage: EncodedImage = {
                fileName: 'First.jpg',
                data: new Uint8Array([1, 2]),
            };
            const secondEncodedImage: EncodedImage = {
                fileName: 'Second.jpg',
                data: new Uint8Array([3, 4]),
            };
            wikiClientSpy.fetchAllCardArtPages.and.resolveTo(cardArtPages);
            imageBuilderSpy.build.withArgs(cardArtPages[0]).and.resolveTo(firstEncodedImage);
            imageBuilderSpy.build.withArgs(cardArtPages[1]).and.resolveTo(secondEncodedImage);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/card_arts/${firstEncodedImage.fileName}`,
                firstEncodedImage.data,
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                `${targetPath}/card_arts/${secondEncodedImage.fileName}`,
                secondEncodedImage.data,
            );
        });
    });
});
