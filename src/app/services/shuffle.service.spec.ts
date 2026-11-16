import { when } from 'vitest-when';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { injectSpy, SpyObj } from 'src/testing/spy-obj';
import { ChanceService } from './chance.service';
import { CardService } from './card.service';
import { DataFixture } from 'src/testing/data-fixture';
import { SetService } from './set.service';
import { ShuffleService } from './shuffle.service';
import { CardType, CardTypeId } from '../models/card-type';
import { Card } from '../models/card';
import { Edition } from '../models/edition';
import { Configuration } from '../models/configuration';
import { SpecialCardsCount } from '../models/special-cards-count';

describe('ShuffleService', () => {
    let shuffleService: ShuffleService;
    let cardServiceSpy: SpyObj<CardService>;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let chanceServiceSpy: SpyObj<ChanceService>;
    let setServiceSpy: SpyObj<SetService>;
    let dataFixture: DataFixture;
    let configuredExpansion: Edition;
    let nonConfiguredExpansion: Edition;
    let configuration: Configuration;
    let kingdomCards: Card[];
    let events: Card[];
    let landmarks: Card[];
    let projects: Card[];
    let ways: Card[];
    let traits: Card[];
    let allies: Card[];
    let prophecies: Card[];
    const kingdomCardsCountOfConfiguredExpansions = 20;
    const singleSpecialCardsCountOfConfiguredExpansions = 5;

    function createCards(
        cardType: CardType,
        isKingdomCard: boolean,
        cardsCountOfConfiguredExpansions: number,
    ): Card[] {
        return [
            ...dataFixture.createCards(cardsCountOfConfiguredExpansions, {
                editions: [configuredExpansion],
                types: [cardType],
                isKingdomCard: isKingdomCard,
            }),
            ...dataFixture.createCards(cardsCountOfConfiguredExpansions, {
                editions: [nonConfiguredExpansion],
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
                    useValue: {
                        findRandomizableKingdomCards: vi.fn(),
                        findByCardType: vi.fn(),
                    },
                },
                {
                    provide: ConfigurationService,
                    useValue: {},
                },
                {
                    provide: ChanceService,
                    useValue: {
                        pickCards: vi.fn(),
                    },
                },
                {
                    provide: SetService,
                    useValue: {
                        updateSet: vi.fn(),
                    },
                },
            ],
        });

        dataFixture = new DataFixture();

        configuredExpansion = dataFixture.createEdition();
        nonConfiguredExpansion = dataFixture.createEdition();
        configuration = dataFixture.createConfiguration({
            editions: [configuredExpansion],
            specialCardsCount: { events: 0, landmarks: 0, projects: 0, ways: 0, traits: 0 },
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
        traits = createCards(
            dataFixture.createCardType({ id: CardTypeId.Trait }),
            false,
            singleSpecialCardsCountOfConfiguredExpansions,
        );
        allies = createCards(
            dataFixture.createCardType({ id: CardTypeId.Ally }),
            false,
            singleSpecialCardsCountOfConfiguredExpansions,
        );
        prophecies = createCards(
            dataFixture.createCardType({ id: CardTypeId.Prophecy }),
            false,
            singleSpecialCardsCountOfConfiguredExpansions,
        );

        cardServiceSpy = injectSpy(CardService);
        cardServiceSpy.findRandomizableKingdomCards.mockReturnValue(kingdomCards);
        when(cardServiceSpy.findByCardType).calledWith(CardTypeId.Event).thenReturn(events);
        when(cardServiceSpy.findByCardType).calledWith(CardTypeId.Landmark).thenReturn(landmarks);
        when(cardServiceSpy.findByCardType).calledWith(CardTypeId.Project).thenReturn(projects);
        when(cardServiceSpy.findByCardType).calledWith(CardTypeId.Way).thenReturn(ways);
        when(cardServiceSpy.findByCardType).calledWith(CardTypeId.Trait).thenReturn(traits);
        when(cardServiceSpy.findByCardType).calledWith(CardTypeId.Ally).thenReturn(allies);
        when(cardServiceSpy.findByCardType).calledWith(CardTypeId.Prophecy).thenReturn(prophecies);

        configurationServiceSpy = injectSpy(ConfigurationService);
        configurationServiceSpy.configuration = signal(configuration);

        chanceServiceSpy = injectSpy(ChanceService);
        chanceServiceSpy.pickCards.mockReturnValue([]);

        setServiceSpy = injectSpy(SetService);
        setServiceSpy.set = signal(dataFixture.createSet());
    });

    describe('shuffleSet', () => {
        it('should update set of SetService', () => {
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleSet();

            expect(setServiceSpy.updateSet).toHaveBeenCalled();
        });

        it('should pick 10 random kingdom cards from configured editions', () => {
            const kingdomCardsOfConfiguredExpansions = kingdomCards.slice(
                0,
                kingdomCardsCountOfConfiguredExpansions,
            );
            const expected = kingdomCards.slice(0, 10);
            when(chanceServiceSpy.pickCards)
                .calledWith(kingdomCardsOfConfiguredExpansions, 10)
                .thenReturn(expected);
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleSet();
            const set = setServiceSpy.updateSet.mock.calls[0][0];

            expect(set.kingdomCards).toEqual(expected);
        });

        (
            [
                ['events', () => events],
                ['landmarks', () => landmarks],
                ['projects', () => projects],
                ['ways', () => ways],
                ['traits', () => traits],
            ] as [keyof SpecialCardsCount, () => Card[]][]
        ).forEach(([specialCards, getSpecialCards]) => {
            it(`with ${specialCards} are available in configured editions should pick configured number of random ${specialCards}`, () => {
                const singleCount = 2;
                configuration.specialCardsCount[specialCards] = singleCount;
                const specialCardsOfConfiguredExpansions = getSpecialCards().slice(
                    0,
                    singleSpecialCardsCountOfConfiguredExpansions,
                );
                const expected = specialCardsOfConfiguredExpansions.slice(0, singleCount);
                when(chanceServiceSpy.pickCards)
                    .calledWith(specialCardsOfConfiguredExpansions, singleCount)
                    .thenReturn(expected);
                shuffleService = TestBed.inject(ShuffleService);

                shuffleService.shuffleSet();
                const set = setServiceSpy.updateSet.mock.lastCall![0];

                expect(set.specialCards).toEqual(expected);
            });

            it(`with ${specialCards} are not available in configured editions should pick no ${specialCards}`, () => {
                const singleCount = 2;
                configuration.specialCardsCount[specialCards] = singleCount;
                for (let i = 0; i < singleSpecialCardsCountOfConfiguredExpansions; i++) {
                    getSpecialCards().shift();
                }
                when(chanceServiceSpy.pickCards).calledWith([], singleCount).thenReturn([]);
                when(chanceServiceSpy.pickCards)
                    .calledWith(
                        expect.arrayContaining([expect.anything()]) as Card[],
                        expect.anything() as number,
                    )
                    .thenReturn(dataFixture.createCards());
                shuffleService = TestBed.inject(ShuffleService);

                shuffleService.shuffleSet();
                const set = setServiceSpy.updateSet.mock.lastCall![0];

                expect(set?.specialCards).toEqual([]);
            });
        });

        it('with shuffeled set contains liaison should contain exact one random ally', () => {
            const kingdomCardsOfConfiguredExpansions = kingdomCards.slice(
                0,
                kingdomCardsCountOfConfiguredExpansions,
            );
            const liaisonCards = dataFixture.createCards(10, {
                types: [dataFixture.createCardType({ id: CardTypeId.Liaison })],
                isKingdomCard: true,
            });
            when(chanceServiceSpy.pickCards)
                .calledWith(kingdomCardsOfConfiguredExpansions, 10)
                .thenReturn(liaisonCards);
            const allyCardsOfConfiguredExpansions = allies.slice(
                0,
                singleSpecialCardsCountOfConfiguredExpansions,
            );
            const expected = allies.slice(0, 1);
            when(chanceServiceSpy.pickCards)
                .calledWith(allyCardsOfConfiguredExpansions, 1)
                .thenReturn(expected);
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleSet();
            const set = setServiceSpy.updateSet.mock.calls[0][0];

            expect(set.specialCards).toEqual(expected);
        });

        it('with shuffeled set contains omen should contain exact one random prophecy', () => {
            const kingdomCardsOfConfiguredExpansions = kingdomCards.slice(
                0,
                kingdomCardsCountOfConfiguredExpansions,
            );
            const omenCards = dataFixture.createCards(10, {
                types: [dataFixture.createCardType({ id: CardTypeId.Omen })],
                isKingdomCard: true,
            });
            when(chanceServiceSpy.pickCards)
                .calledWith(kingdomCardsOfConfiguredExpansions, 10)
                .thenReturn(omenCards);
            const prophecyCardsOfConfiguredExpansions = prophecies.slice(
                0,
                singleSpecialCardsCountOfConfiguredExpansions,
            );
            const expected = prophecies.slice(0, 1);
            when(chanceServiceSpy.pickCards)
                .calledWith(prophecyCardsOfConfiguredExpansions, 1)
                .thenReturn(expected);
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleSet();
            const set = setServiceSpy.updateSet.mock.calls[0][0];

            expect(set.specialCards).toEqual(expected);
        });

        it('with shuffeled set contains liaison and omen should contain an ally and a prophecy', () => {
            const kingdomCardsOfConfiguredExpansions = kingdomCards.slice(
                0,
                kingdomCardsCountOfConfiguredExpansions,
            );
            const liaisonCards = dataFixture.createCards(9, {
                types: [dataFixture.createCardType({ id: CardTypeId.Liaison })],
                isKingdomCard: true,
            });
            const omenCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Omen })],
                isKingdomCard: true,
            });
            when(chanceServiceSpy.pickCards)
                .calledWith(kingdomCardsOfConfiguredExpansions, 10)
                .thenReturn([...liaisonCards, omenCard]);
            const allyCardsOfConfiguredExpansions = allies.slice(
                0,
                singleSpecialCardsCountOfConfiguredExpansions,
            );
            when(chanceServiceSpy.pickCards)
                .calledWith(allyCardsOfConfiguredExpansions, 1)
                .thenReturn(allies.slice(0, 1));
            const prophecyCardsOfConfiguredExpansions = prophecies.slice(
                0,
                singleSpecialCardsCountOfConfiguredExpansions,
            );
            when(chanceServiceSpy.pickCards)
                .calledWith(prophecyCardsOfConfiguredExpansions, 1)
                .thenReturn(prophecies.slice(0, 1));
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleSet();
            const set = setServiceSpy.updateSet.mock.calls[0][0];

            expect(set.specialCards).toEqual([...allies.slice(0, 1), ...prophecies.slice(0, 1)]);
        });
    });

    describe('shuffleSingleCard', () => {
        it('with no ally is available should not add an ally to the set', () => {
            const nonLiaisonCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Action })],
                isKingdomCard: true,
            });
            const liaisonCard = dataFixture.createCard({
                types: [dataFixture.createCardType({ id: CardTypeId.Liaison })],
                isKingdomCard: true,
            });
            const currentSet = dataFixture.createSet({
                kingdomCards: [nonLiaisonCard],
                specialCards: [],
            });
            setServiceSpy.set = signal(currentSet);
            chanceServiceSpy.pickCards.mockReturnValueOnce([liaisonCard]).mockReturnValueOnce([]);
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleSingleCard(nonLiaisonCard);
            const actual = setServiceSpy.updateSet.mock.lastCall![0];

            expect(actual.specialCards).toEqual([]);
        });

        it('should update set of SetService with a new set and leave the current one unchanged', () => {
            const oldCard = kingdomCards[0];
            const newCard = kingdomCards[10];
            const currentSet = dataFixture.createSet({
                kingdomCards: kingdomCards.slice(0, 10),
                specialCards: [],
            });
            const expected = [...currentSet.kingdomCards];
            setServiceSpy.set = signal(currentSet);
            chanceServiceSpy.pickCards.mockReturnValueOnce([newCard]).mockReturnValueOnce([]);
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleSingleCard(oldCard);
            const actual = setServiceSpy.updateSet.mock.lastCall![0];

            expect(actual, 'new set').not.toBe(currentSet);
            expect(currentSet.kingdomCards, 'current set').toEqual(expected);
        });

        it('with card is kingdom card should pick different random kingdom card from configured editions', () => {
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
            setServiceSpy.set = signal(currentSet);
            when(chanceServiceSpy.pickCards).calledWith(candidates, 1).thenReturn([newCard]);
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleSingleCard(oldCard);
            const actual = setServiceSpy.updateSet.mock.lastCall![0];

            expect(actual.kingdomCards, 'oldCard').not.toContain(oldCard);
            expect(actual.kingdomCards, 'newCard').toContain(newCard);
        });

        (
            [
                ['event', () => events],
                ['landmark', () => landmarks],
                ['project', () => projects],
                ['way', () => ways],
                ['trait', () => traits],
            ] as [string, () => Card[]][]
        ).forEach(([specialCard, getSpecialCards]) => {
            it(`with card is ${specialCard} should pick different random ${specialCard} from configured editions`, () => {
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
                setServiceSpy.set = signal(currentSet);
                when(chanceServiceSpy.pickCards).calledWith(candidates, 1).thenReturn([newCard]);
                shuffleService = TestBed.inject(ShuffleService);

                shuffleService.shuffleSingleCard(oldCard);
                const actual = setServiceSpy.updateSet.mock.lastCall![0];

                expect(actual.specialCards, 'oldCard').not.toContain(oldCard);
                expect(actual.specialCards, 'newCard').toContain(newCard);
            });
        });

        [
            {
                triggeringCard: 'liaison',
                dependentCard: 'ally',
                triggeringCardTypeId: CardTypeId.Liaison,
                dependentCardTypeId: CardTypeId.Ally,
                getDependentCards: () => allies,
            },
            {
                triggeringCard: 'omen',
                dependentCard: 'prophecy',
                triggeringCardTypeId: CardTypeId.Omen,
                dependentCardTypeId: CardTypeId.Prophecy,
                getDependentCards: () => prophecies,
            },
        ].forEach(
            ({
                triggeringCard,
                dependentCard,
                triggeringCardTypeId,
                dependentCardTypeId,
                getDependentCards,
            }) => {
                it(`with card is ${dependentCard} should pick different random ${dependentCard} from configured editions`, () => {
                    const triggeringCardOfSet = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: triggeringCardTypeId })],
                        isKingdomCard: true,
                    });
                    const dependentCardsOfConfiguredExpansions = getDependentCards().slice(
                        0,
                        singleSpecialCardsCountOfConfiguredExpansions,
                    );
                    const currentSet = dataFixture.createSet({
                        kingdomCards: [triggeringCardOfSet],
                        specialCards: dependentCardsOfConfiguredExpansions.slice(0, 1),
                    });
                    const candidates = dependentCardsOfConfiguredExpansions.slice(
                        1,
                        singleSpecialCardsCountOfConfiguredExpansions,
                    );
                    const oldCard = currentSet.specialCards[0];
                    const expected = candidates[0];
                    setServiceSpy.set = signal(currentSet);
                    when(chanceServiceSpy.pickCards)
                        .calledWith(candidates, 1)
                        .thenReturn([expected]);
                    shuffleService = TestBed.inject(ShuffleService);

                    shuffleService.shuffleSingleCard(oldCard);
                    const actual = setServiceSpy.updateSet.mock.lastCall![0];

                    expect(actual.specialCards).toEqual([expected]);
                });

                it(`with card is single ${triggeringCard} of set and is replaced by ${triggeringCard} should return correct set`, () => {
                    const oldTriggeringCard = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: triggeringCardTypeId })],
                        isKingdomCard: true,
                    });
                    const newTriggeringCard = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: triggeringCardTypeId })],
                        isKingdomCard: true,
                    });
                    const expected = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: dependentCardTypeId })],
                        isKingdomCard: false,
                    });
                    const currentSet = dataFixture.createSet({
                        kingdomCards: [oldTriggeringCard],
                        specialCards: [expected],
                    });
                    setServiceSpy.set = signal(currentSet);
                    chanceServiceSpy.pickCards.mockReturnValue([newTriggeringCard]);
                    shuffleService = TestBed.inject(ShuffleService);

                    shuffleService.shuffleSingleCard(oldTriggeringCard);
                    const actual = setServiceSpy.updateSet.mock.lastCall![0];

                    expect(actual.specialCards).toEqual([expected]);
                });

                it(`with card is single ${triggeringCard} of set and is replaced by non-${triggeringCard} should return correct set`, () => {
                    const triggeringCardOfSet = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: triggeringCardTypeId })],
                        isKingdomCard: true,
                    });
                    const nonTriggeringCard = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: CardTypeId.Action })],
                        isKingdomCard: true,
                    });
                    const dependentCardOfSet = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: dependentCardTypeId })],
                        isKingdomCard: false,
                    });
                    const currentSet = dataFixture.createSet({
                        kingdomCards: [triggeringCardOfSet],
                        specialCards: [dependentCardOfSet],
                    });
                    setServiceSpy.set = signal(currentSet);
                    chanceServiceSpy.pickCards.mockReturnValue([nonTriggeringCard]);
                    shuffleService = TestBed.inject(ShuffleService);

                    shuffleService.shuffleSingleCard(triggeringCardOfSet);
                    const actual = setServiceSpy.updateSet.mock.lastCall![0];

                    expect(actual.specialCards).toEqual([]);
                });

                it(`with card is ${triggeringCard} of multiple and is replaced by non-${triggeringCard} should return correct set`, () => {
                    const triggeringCardsOfSet = dataFixture.createCards(5, {
                        types: [dataFixture.createCardType({ id: triggeringCardTypeId })],
                        isKingdomCard: true,
                    });
                    const nonTriggeringCard = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: CardTypeId.Action })],
                        isKingdomCard: true,
                    });
                    const expected = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: dependentCardTypeId })],
                        isKingdomCard: false,
                    });
                    const currentSet = dataFixture.createSet({
                        kingdomCards: triggeringCardsOfSet,
                        specialCards: [expected],
                    });
                    setServiceSpy.set = signal(currentSet);
                    chanceServiceSpy.pickCards.mockReturnValue([nonTriggeringCard]);
                    shuffleService = TestBed.inject(ShuffleService);

                    shuffleService.shuffleSingleCard(triggeringCardsOfSet[0]);
                    const actual = setServiceSpy.updateSet.mock.lastCall![0];

                    expect(actual.specialCards).toEqual([expected]);
                });

                it(`with card of non-${triggeringCard}-set is replaced by ${triggeringCard} should return correct set`, () => {
                    const nonTriggeringCard = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: CardTypeId.Action })],
                        isKingdomCard: true,
                    });
                    const newTriggeringCard = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: triggeringCardTypeId })],
                        isKingdomCard: true,
                    });
                    const expected = dataFixture.createCard({
                        types: [dataFixture.createCardType({ id: dependentCardTypeId })],
                        isKingdomCard: false,
                    });
                    const currentSet = dataFixture.createSet({
                        kingdomCards: [nonTriggeringCard],
                        specialCards: [],
                    });
                    setServiceSpy.set = signal(currentSet);
                    chanceServiceSpy.pickCards
                        .mockReturnValueOnce([newTriggeringCard])
                        .mockReturnValueOnce([expected]);
                    shuffleService = TestBed.inject(ShuffleService);

                    shuffleService.shuffleSingleCard(nonTriggeringCard);
                    const actual = setServiceSpy.updateSet.mock.lastCall![0];

                    expect(actual.specialCards).toEqual([expected]);
                });
            },
        );
    });
});
