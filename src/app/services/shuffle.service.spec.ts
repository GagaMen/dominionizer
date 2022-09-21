import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { SpyObj } from 'src/testing/spy-obj';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { ChanceService } from './chance.service';
import { CardService } from './card.service';
import { DataFixture } from 'src/testing/data-fixture';
import { SetService } from './set.service';
import { ShuffleService } from './shuffle.service';
import { CardType, CardTypeId } from '../models/card-type';
import { Card } from '../models/card';
import { Expansion } from '../models/expansion';
import { Configuration } from '../models/configuration';
import { SpecialCardsCount } from '../models/special-cards-count';

describe('ShuffleService', () => {
    let shuffleService: ShuffleService;
    let cardServiceSpy: SpyObj<CardService>;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let chanceServiceSpy: SpyObj<ChanceService>;
    let setServiceSpy: SpyObj<SetService>;
    let dataFixture: DataFixture;
    let configuredExpansion: Expansion;
    let nonConfiguredExpansion: Expansion;
    let configuration: Configuration;
    let kingdomCards: Card[];
    let events: Card[];
    let landmarks: Card[];
    let projects: Card[];
    let ways: Card[];
    let allies: Card[];
    const kingdomCardsCountOfConfiguredExpansions = 20;
    const singleSpecialCardsCountOfConfiguredExpansions = 5;

    function createCards(
        cardType: CardType,
        isKingdomCard: boolean,
        cardsCountOfConfiguredExpansions: number,
    ): Card[] {
        return [
            ...dataFixture.createCards(cardsCountOfConfiguredExpansions, {
                expansions: [configuredExpansion],
                types: [cardType],
                isKingdomCard: isKingdomCard,
            }),
            ...dataFixture.createCards(cardsCountOfConfiguredExpansions, {
                expansions: [nonConfiguredExpansion],
                types: [cardType],
                isKingdomCard: isKingdomCard,
            }),
        ];
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: CardService,
                    useValue: jasmine.createSpyObj<CardService>('CardService', [
                        'findRandomizableKingdomCards',
                        'findByCardType',
                    ]),
                },
                {
                    provide: ConfigurationService,
                    useValue: {},
                },
                {
                    provide: ChanceService,
                    useValue: jasmine.createSpyObj<ChanceService>('ChanceService', ['pickCards']),
                },
                {
                    provide: SetService,
                    useValue: jasmine.createSpyObj<SetService>('SetService', ['updateSet']),
                },
            ],
        });

        dataFixture = new DataFixture();

        configuredExpansion = dataFixture.createExpansion();
        nonConfiguredExpansion = dataFixture.createExpansion();
        configuration = dataFixture.createConfiguration({
            expansions: [configuredExpansion],
            specialCardsCount: { events: 0, landmarks: 0, projects: 0, ways: 0 },
        });
        kingdomCards = createCards(
            dataFixture.createCardType({ id: CardTypeId.Liaison }),
            true,
            kingdomCardsCountOfConfiguredExpansions,
        );
        events = createCards(
            dataFixture.createCardType({ id: CardTypeId.Event }),
            false,
            singleSpecialCardsCountOfConfiguredExpansions,
        );
        landmarks = createCards(
            dataFixture.createCardType({ id: CardTypeId.Landmark }),
            false,
            singleSpecialCardsCountOfConfiguredExpansions,
        );
        projects = createCards(
            dataFixture.createCardType({ id: CardTypeId.Project }),
            false,
            singleSpecialCardsCountOfConfiguredExpansions,
        );
        ways = createCards(
            dataFixture.createCardType({ id: CardTypeId.Way }),
            false,
            singleSpecialCardsCountOfConfiguredExpansions,
        );
        allies = createCards(
            dataFixture.createCardType({ id: CardTypeId.Ally }),
            false,
            singleSpecialCardsCountOfConfiguredExpansions,
        );

        cardServiceSpy = TestBed.inject(CardService) as jasmine.SpyObj<CardService>;
        cardServiceSpy.findRandomizableKingdomCards.and.returnValue(
            cold('(a|)', { a: kingdomCards }),
        );
        cardServiceSpy.findByCardType
            .withArgs(CardTypeId.Event)
            .and.returnValue(cold('(a|)', { a: events }));
        cardServiceSpy.findByCardType
            .withArgs(CardTypeId.Landmark)
            .and.returnValue(cold('(a|)', { a: landmarks }));
        cardServiceSpy.findByCardType
            .withArgs(CardTypeId.Project)
            .and.returnValue(cold('(a|)', { a: projects }));
        cardServiceSpy.findByCardType
            .withArgs(CardTypeId.Way)
            .and.returnValue(cold('(a|)', { a: ways }));
        cardServiceSpy.findByCardType
            .withArgs(CardTypeId.Ally)
            .and.returnValue(cold('(a|)', { a: allies }));

        configurationServiceSpy = TestBed.inject(
            ConfigurationService,
        ) as jasmine.SpyObj<ConfigurationService>;
        configurationServiceSpy.configuration$ = cold('a', { a: configuration });

        chanceServiceSpy = TestBed.inject(ChanceService) as jasmine.SpyObj<ChanceService>;
        chanceServiceSpy.pickCards.and.returnValue([]);

        setServiceSpy = TestBed.inject(SetService) as jasmine.SpyObj<SetService>;
        setServiceSpy.set$ = cold('a', { a: dataFixture.createSet() });
    });

    describe('shuffleSet', () => {
        it('should update set of SetService', () => {
            shuffleService = TestBed.inject(ShuffleService);
            getTestScheduler().flush();

            shuffleService.shuffleSet();

            expect(setServiceSpy.updateSet).toHaveBeenCalled();
        });

        it('should pick 10 random kingdom cards from configured expansions', () => {
            const kingdomCardsOfConfiguredExpansions = kingdomCards.slice(
                0,
                kingdomCardsCountOfConfiguredExpansions,
            );
            const expected = kingdomCards.slice(0, 10);
            chanceServiceSpy.pickCards
                .withArgs(kingdomCardsOfConfiguredExpansions, 10)
                .and.returnValue(expected);
            shuffleService = TestBed.inject(ShuffleService);
            getTestScheduler().flush();

            shuffleService.shuffleSet();
            const set = setServiceSpy.updateSet.calls.first().args[0];

            expect(set.kingdomCards).toEqual(expected);
        });

        (
            [
                ['events', () => events],
                ['landmarks', () => landmarks],
                ['projects', () => projects],
                ['ways', () => ways],
            ] as [keyof SpecialCardsCount, () => Card[]][]
        ).forEach(([specialCards, getSpecialCards]) => {
            it(`with ${specialCards} are available in configured expansions should pick configured number of random ${specialCards}`, () => {
                const singleCount = 2;
                configuration.specialCardsCount[specialCards] = singleCount;
                const specialCardsOfConfiguredExpansions = getSpecialCards().slice(
                    0,
                    singleSpecialCardsCountOfConfiguredExpansions,
                );
                const expected = specialCardsOfConfiguredExpansions.slice(0, singleCount);
                chanceServiceSpy.pickCards
                    .withArgs(specialCardsOfConfiguredExpansions, singleCount)
                    .and.returnValue(expected);
                shuffleService = TestBed.inject(ShuffleService);
                getTestScheduler().flush();

                shuffleService.shuffleSet();
                const set = setServiceSpy.updateSet.calls.mostRecent().args[0];

                expect(set.specialCards).toEqual(expected);
            });

            it(`with ${specialCards} are not available in configured expansions should pick no ${specialCards}`, () => {
                const singleCount = 2;
                configuration.specialCardsCount[specialCards] = singleCount;
                for (let i = 0; i < singleSpecialCardsCountOfConfiguredExpansions; i++) {
                    getSpecialCards().shift();
                }
                chanceServiceSpy.pickCards.withArgs([], singleCount).and.returnValue([]);
                chanceServiceSpy.pickCards
                    .withArgs(jasmine.notEmpty(), jasmine.anything())
                    .and.returnValue(dataFixture.createCards());
                shuffleService = TestBed.inject(ShuffleService);
                getTestScheduler().flush();

                shuffleService.shuffleSet();
                const set = setServiceSpy.updateSet.calls.mostRecent()?.args[0];

                expect(set?.specialCards).toEqual([]);
            });
        });

        it('with shuffeled set contains liaison should contain exact one random ally', () => {
            const kingdomCardsOfConfiguredExpansions = kingdomCards.slice(
                0,
                kingdomCardsCountOfConfiguredExpansions,
            );
            chanceServiceSpy.pickCards
                .withArgs(kingdomCardsOfConfiguredExpansions, 10)
                .and.returnValue(kingdomCards.slice(0, 10));
            const allyCardsOfConfiguredExpansions = allies.slice(
                0,
                singleSpecialCardsCountOfConfiguredExpansions,
            );
            const expected = allies.slice(0, 1);
            chanceServiceSpy.pickCards
                .withArgs(allyCardsOfConfiguredExpansions, 1)
                .and.returnValue(expected);
            shuffleService = TestBed.inject(ShuffleService);
            getTestScheduler().flush();

            shuffleService.shuffleSet();
            const set = setServiceSpy.updateSet.calls.first().args[0];

            expect(set.specialCards).toEqual(expected);
        });
    });

    describe('shuffleSingleCard', () => {
        it('with card is kingdom card should pick different random kingdom card from configured expansions', () => {
            const kingdomCardsOfConfiguredExpansions = kingdomCards.slice(
                0,
                kingdomCardsCountOfConfiguredExpansions,
            );
            const currentSet = dataFixture.createSet({
                kingdomCards: kingdomCardsOfConfiguredExpansions.slice(0, 10),
            });
            const candidates = kingdomCardsOfConfiguredExpansions.slice(
                10,
                kingdomCardsCountOfConfiguredExpansions,
            );
            const oldCard = currentSet.kingdomCards[0];
            const newCard = candidates[0];
            setServiceSpy.set$ = cold('a', { a: currentSet });
            chanceServiceSpy.pickCards.withArgs(candidates, 1).and.returnValue([newCard]);
            shuffleService = TestBed.inject(ShuffleService);
            getTestScheduler().flush();

            shuffleService.shuffleSingleCard(oldCard);
            const actual = setServiceSpy.updateSet.calls.mostRecent().args[0];

            expect(actual.kingdomCards).withContext('oldCard').not.toContain(oldCard);
            expect(actual.kingdomCards).withContext('newCard').toContain(newCard);
        });

        (
            [
                ['event', () => events],
                ['landmark', () => landmarks],
                ['project', () => projects],
                ['way', () => ways],
                ['ally', () => allies],
            ] as [string, () => Card[]][]
        ).forEach(([specialCard, getSpecialCards]) => {
            it(`with card is ${specialCard} should pick different random ${specialCard} from configured expansions`, () => {
                const singleCount = 2;
                const specialCardsOfConfiguredExpansions = getSpecialCards().slice(
                    0,
                    singleSpecialCardsCountOfConfiguredExpansions,
                );
                const currentSet = dataFixture.createSet({
                    kingdomCards,
                    specialCards: specialCardsOfConfiguredExpansions.slice(0, singleCount),
                });
                const candidates = specialCardsOfConfiguredExpansions.slice(
                    singleCount,
                    singleSpecialCardsCountOfConfiguredExpansions,
                );
                const oldCard = currentSet.specialCards[0];
                const newCard = candidates[0];
                setServiceSpy.set$ = cold('a', { a: currentSet });
                chanceServiceSpy.pickCards.withArgs(candidates, 1).and.returnValue([newCard]);
                shuffleService = TestBed.inject(ShuffleService);
                getTestScheduler().flush();

                shuffleService.shuffleSingleCard(oldCard);
                const actual = setServiceSpy.updateSet.calls.mostRecent().args[0];

                expect(actual.specialCards).withContext('oldCard').not.toContain(oldCard);
                expect(actual.specialCards).withContext('newCard').toContain(newCard);
            });
        });

        it('with card is single liaison of set and is replaced by liaison should return correct set', () => {
            const oldLiaisonCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Liaison })],
                isKingdomCard: true,
            });
            const newLiaisonCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Liaison })],
                isKingdomCard: true,
            });
            const allyCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Ally })],
                isKingdomCard: false,
            });
            const currentSet = dataFixture.createSet({
                kingdomCards: [oldLiaisonCard],
                specialCards: [allyCard],
            });
            setServiceSpy.set$ = cold('a', { a: currentSet });
            chanceServiceSpy.pickCards.and.returnValue([newLiaisonCard]);
            shuffleService = TestBed.inject(ShuffleService);
            getTestScheduler().flush();

            shuffleService.shuffleSingleCard(oldLiaisonCard);
            const actual = setServiceSpy.updateSet.calls.mostRecent().args[0];

            expect(actual.specialCards).toEqual([allyCard]);
        });

        it('with card is single liaison of set and is replaced by non-liaison should return correct set', () => {
            const liaisonCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Liaison })],
                isKingdomCard: true,
            });
            const nonLiaisonCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Action })],
                isKingdomCard: true,
            });
            const allyCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Ally })],
                isKingdomCard: false,
            });
            const currentSet = dataFixture.createSet({
                kingdomCards: [liaisonCard],
                specialCards: [allyCard],
            });
            setServiceSpy.set$ = cold('a', { a: currentSet });
            chanceServiceSpy.pickCards.and.returnValue([nonLiaisonCard]);
            shuffleService = TestBed.inject(ShuffleService);
            getTestScheduler().flush();

            shuffleService.shuffleSingleCard(liaisonCard);
            const actual = setServiceSpy.updateSet.calls.mostRecent().args[0];

            expect(actual.specialCards).toEqual([]);
        });

        it('with card is liaison of multiple and is replaced by non-liaison should return correct set', () => {
            const liaisonCards = dataFixture.createCards(5, {
                types: [dataFixture.createCardType({ id: CardTypeId.Liaison })],
                isKingdomCard: true,
            });
            const nonLiaisonCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Action })],
                isKingdomCard: true,
            });
            const allyCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Ally })],
                isKingdomCard: false,
            });
            const currentSet = dataFixture.createSet({
                kingdomCards: liaisonCards,
                specialCards: [allyCard],
            });
            setServiceSpy.set$ = cold('a', { a: currentSet });
            chanceServiceSpy.pickCards.and.returnValue([nonLiaisonCard]);
            shuffleService = TestBed.inject(ShuffleService);
            getTestScheduler().flush();

            shuffleService.shuffleSingleCard(liaisonCards[0]);
            const actual = setServiceSpy.updateSet.calls.mostRecent().args[0];

            expect(actual.specialCards).toEqual([allyCard]);
        });

        it('with card of non-liaison-set is replaced by liaison should return correct set', () => {
            const nonLiaisonCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Action })],
                isKingdomCard: true,
            });
            const liaisonCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Liaison })],
                isKingdomCard: true,
            });
            const allyCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Ally })],
                isKingdomCard: false,
            });
            const currentSet = dataFixture.createSet({
                kingdomCards: [nonLiaisonCard],
                specialCards: [],
            });
            setServiceSpy.set$ = cold('a', { a: currentSet });
            chanceServiceSpy.pickCards.and.returnValues([liaisonCard], [allyCard]);
            shuffleService = TestBed.inject(ShuffleService);
            getTestScheduler().flush();

            shuffleService.shuffleSingleCard(nonLiaisonCard);
            const actual = setServiceSpy.updateSet.calls.mostRecent().args[0];

            expect(actual.specialCards).toEqual([allyCard]);
        });
    });
});
