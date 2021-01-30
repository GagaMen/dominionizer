import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { SpyObj } from 'src/testing/spy-obj';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { ChanceService } from './chance.service';
import { CardService } from './card.service';
import { DataFixture } from 'src/testing/data-fixture';
import { SetService } from './set.service';
import { ShuffleService } from './shuffle.service';
import { CardType } from '../models/card-type';
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
                    useValue: jasmine.createSpyObj<SetService>('SetService', [
                        'updateSet',
                        'updateSingleCard',
                    ]),
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
        kingdomCards = createCards(CardType.Action, true, kingdomCardsCountOfConfiguredExpansions);
        events = createCards(CardType.Event, false, singleSpecialCardsCountOfConfiguredExpansions);
        landmarks = createCards(
            CardType.Landmark,
            false,
            singleSpecialCardsCountOfConfiguredExpansions,
        );
        projects = createCards(
            CardType.Project,
            false,
            singleSpecialCardsCountOfConfiguredExpansions,
        );
        ways = createCards(CardType.Way, false, singleSpecialCardsCountOfConfiguredExpansions);

        cardServiceSpy = TestBed.inject(CardService) as jasmine.SpyObj<CardService>;
        cardServiceSpy.findRandomizableKingdomCards.and.returnValue(
            cold('(a|)', { a: kingdomCards }),
        );
        cardServiceSpy.findByCardType
            .withArgs(CardType.Event)
            .and.returnValue(cold('(a|)', { a: events }));
        cardServiceSpy.findByCardType
            .withArgs(CardType.Landmark)
            .and.returnValue(cold('(a|)', { a: landmarks }));
        cardServiceSpy.findByCardType
            .withArgs(CardType.Project)
            .and.returnValue(cold('(a|)', { a: projects }));
        cardServiceSpy.findByCardType
            .withArgs(CardType.Way)
            .and.returnValue(cold('(a|)', { a: ways }));

        configurationServiceSpy = TestBed.inject(ConfigurationService) as jasmine.SpyObj<
            ConfigurationService
        >;
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

        ([
            ['events', () => events],
            ['landmarks', () => landmarks],
            ['projects', () => projects],
            ['ways', () => ways],
        ] as [keyof SpecialCardsCount, () => Card[]][]).forEach(
            ([specialCards, getSpecialCards]) => {
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
            },
        );
    });

    describe('shuffleSingleCard', () => {
        it('should update single card of SetService', () => {
            const card = dataFixture.createCard();
            shuffleService = TestBed.inject(ShuffleService);
            getTestScheduler().flush();

            shuffleService.shuffleSingleCard(card);

            expect(setServiceSpy.updateSingleCard).toHaveBeenCalled();
        });

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
            const expectedOldCard = currentSet.kingdomCards[0];
            const expectedNewCard = candidates[0];
            setServiceSpy.set$ = cold('a', { a: currentSet });
            chanceServiceSpy.pickCards.withArgs(candidates, 1).and.returnValue([expectedNewCard]);
            shuffleService = TestBed.inject(ShuffleService);
            getTestScheduler().flush();

            shuffleService.shuffleSingleCard(expectedOldCard);
            const actualOldCard = setServiceSpy.updateSingleCard.calls.mostRecent().args[0];
            const actualNewCard = setServiceSpy.updateSingleCard.calls.mostRecent().args[1];

            expect(actualOldCard).withContext('oldCard').toEqual(expectedOldCard);
            expect(actualNewCard).withContext('newCard').toEqual(expectedNewCard);
        });

        ([
            ['event', () => events],
            ['landmark', () => landmarks],
            ['project', () => projects],
            ['way', () => ways],
        ] as [string, () => Card[]][]).forEach(([specialCard, getSpecialCards]) => {
            it(`with card is ${specialCard} should pick different random ${specialCard} from configured expansions`, () => {
                const singleCount = 2;
                const specialCardsOfConfiguredExpansions = getSpecialCards().slice(
                    0,
                    singleSpecialCardsCountOfConfiguredExpansions,
                );
                const currentSet = dataFixture.createSet({
                    specialCards: specialCardsOfConfiguredExpansions.slice(0, singleCount),
                });
                const candidates = specialCardsOfConfiguredExpansions.slice(
                    singleCount,
                    singleSpecialCardsCountOfConfiguredExpansions,
                );
                const expectedOldCard = currentSet.specialCards[0];
                const expectedNewCard = candidates[0];
                setServiceSpy.set$ = cold('a', { a: currentSet });
                chanceServiceSpy.pickCards
                    .withArgs(candidates, 1)
                    .and.returnValue([expectedNewCard]);
                shuffleService = TestBed.inject(ShuffleService);
                getTestScheduler().flush();

                shuffleService.shuffleSingleCard(expectedOldCard);
                const actualOldCard = setServiceSpy.updateSingleCard.calls.mostRecent().args[0];
                const actualNewCard = setServiceSpy.updateSingleCard.calls.mostRecent().args[1];

                expect(actualOldCard).withContext('oldCard').toEqual(expectedOldCard);
                expect(actualNewCard).withContext('newCard').toEqual(expectedNewCard);
            });
        });
    });
});
