import { CardTranslationBuilder } from './builder/card-translation-builder';
import { CardTranslation } from './../../../../src/app/models/card';
import { ExpansionCardsMapBuilder } from './builder/expansion-cards-map-builder';
import { CardDto } from './../../../../src/app/dtos/card-dto';
import { CardDtoBuilder } from './builder/card-dto-builder';
import { ExpansionTranslationBuilder } from './builder/expansion-translation-builder';
import { Expansion, ExpansionTranslation } from './../../../../src/app/models/expansion';
import { ExpansionBuilder } from './builder/expansion-builder';
import { DominionizerWikiBot } from './dominionizer-wiki-bot';
import { ExpansionPage, CardPage } from './wiki-client/api-models';
import { WikiClient } from './wiki-client/wiki-client';
import * as Fs from 'fs/promises';

describe('DominionizerWikiBot', () => {
    let dominionizerWikiBot: DominionizerWikiBot;
    let wikiClientSpy: jasmine.SpyObj<WikiClient>;
    let expansionBuilderSpy: jasmine.SpyObj<ExpansionBuilder>;
    let expansionTranslationBuilderSpy: jasmine.SpyObj<ExpansionTranslationBuilder>;
    let expansionCardsMapBuilderSpy: jasmine.SpyObj<ExpansionCardsMapBuilder>;
    let cardDtoBuilderSpy: jasmine.SpyObj<CardDtoBuilder>;
    let cardTranslationBuilderSpy: jasmine.SpyObj<CardTranslationBuilder>;
    let writeFileSpy: jasmine.Spy;

    beforeEach(() => {
        wikiClientSpy = jasmine.createSpyObj<WikiClient>('WikiClient', [
            'fetchAllExpansionPages',
            'fetchAllCardPages',
        ]);
        wikiClientSpy.fetchAllExpansionPages.and.returnValue(Promise.resolve([]));
        wikiClientSpy.fetchAllCardPages.and.returnValue(Promise.resolve([]));

        expansionBuilderSpy = jasmine.createSpyObj<ExpansionBuilder>('ExpansionBuilder', ['build']);

        expansionTranslationBuilderSpy = jasmine.createSpyObj<ExpansionTranslationBuilder>(
            'ExpansionTranslationBuilder',
            ['build'],
        );
        expansionTranslationBuilderSpy.build.and.returnValue(new Map());

        expansionCardsMapBuilderSpy = jasmine.createSpyObj<ExpansionCardsMapBuilder>(
            'ExpansionCardsMapBuilder',
            ['build'],
        );
        expansionCardsMapBuilderSpy.build.and.returnValue(new Map());

        cardDtoBuilderSpy = jasmine.createSpyObj<CardDtoBuilder>('CardDtoBuilder', ['build']);

        cardTranslationBuilderSpy = jasmine.createSpyObj<CardTranslationBuilder>(
            'CardTranslationBuilder',
            ['build'],
        );
        cardTranslationBuilderSpy.build.and.returnValue(new Map());

        writeFileSpy = spyOn(Fs, 'writeFile');

        dominionizerWikiBot = new DominionizerWikiBot(
            wikiClientSpy,
            expansionBuilderSpy,
            expansionTranslationBuilderSpy,
            expansionCardsMapBuilderSpy,
            cardDtoBuilderSpy,
            cardTranslationBuilderSpy,
        );
    });

    describe('generateAll', () => {
        // generate card symbols
        // generate card art
        // success logging for each step
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
                'expansions.json',
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
                'expansions.german.json',
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                'expansions.french.json',
                JSON.stringify(frenchTranslations),
            );
        });

        it('should generate cards', async () => {
            const expansionPages: ExpansionPage[] = [
                { pageid: 1 } as ExpansionPage,
                { pageid: 2 } as ExpansionPage,
            ];
            const cardPages: CardPage[] = [
                { pageid: 10, title: 'Card 10' } as CardPage,
                { pageid: 20, title: 'Card 20' } as CardPage,
            ];
            const cardExpansionsMap: Map<string, number[]> = new Map([
                ['Card 10', [1]],
                ['Card 20', [1, 2]],
            ]);
            const cards: CardDto[] = [
                { id: 10, name: 'Card 10', expansions: [1] } as CardDto,
                { id: 20, name: 'Card 20', expansions: [1, 2] } as CardDto,
            ];
            wikiClientSpy.fetchAllExpansionPages.and.resolveTo(expansionPages);
            wikiClientSpy.fetchAllCardPages.and.resolveTo(cardPages);
            expansionCardsMapBuilderSpy.build
                .withArgs(expansionPages[0])
                .and.returnValue(new Map([[1, ['Card 10', 'Card 20']]]));
            expansionCardsMapBuilderSpy.build
                .withArgs(expansionPages[1])
                .and.returnValue(new Map([[2, ['Card 20']]]));
            cardDtoBuilderSpy.build
                .withArgs(cardPages[0], cardExpansionsMap)
                .and.returnValue(cards[0]);
            cardDtoBuilderSpy.build
                .withArgs(cardPages[1], cardExpansionsMap)
                .and.returnValue(cards[1]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith('cards.json', JSON.stringify(cards));
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
                .withArgs(cardPages[0], jasmine.anything())
                .and.returnValue(cards[0]);
            cardDtoBuilderSpy.build
                .withArgs(cardPages[1], jasmine.anything())
                .and.returnValue(cards[1]);
            cardTranslationBuilderSpy.build
                .withArgs(cardPages[0], cards[0])
                .and.returnValue(firstCardTranslations);
            cardTranslationBuilderSpy.build
                .withArgs(cardPages[1], cards[1])
                .and.returnValue(secondCardTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                'cards.german.json',
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                'cards.french.json',
                JSON.stringify(frenchTranslations),
            );
        });
    });
});
