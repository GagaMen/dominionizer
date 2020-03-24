import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';

import { CardService } from './card.service';
import { DataService } from './data.service';
import { Card } from '../models/card';
import { CardType } from '../models/card-type';
import { SpyObj } from 'src/testing/spy-obj';
import { CardDto } from '../dtos/card-dto';
import { Expansion } from '../models/expansion';
import { ExpansionService } from './expansion.service';

describe('CardService', () => {
    let cardService: CardService;
    let dataServiceSpy: SpyObj<DataService>;
    let expansionServiceSpy: SpyObj<ExpansionService>;

    const defaultTestCardDto: CardDto = {
        id: 1,
        name: 'Default Test Card',
        expansions: [1],
        types: [CardType.Action],
        isKingdomCard: true,
    };
    const testCardDtos: CardDto[] = [
        {
            id: 1,
            name: 'First Test Card',
            expansions: [1, 2],
            types: [CardType.Action],
            isKingdomCard: true,
        },
        {
            id: 2,
            name: 'Second Test Card',
            expansions: [2],
            types: [CardType.Event],
            isKingdomCard: false,
        },
    ];
    const testExpansions: Expansion[] = [
        { id: 1, name: 'First Test Expansion' },
        { id: 2, name: 'Second Test Expansion' },
    ];
    const testCards: Card[] = [
        {
            id: 1,
            name: 'First Test Card',
            expansions: [testExpansions[0], testExpansions[1]],
            types: [CardType.Action],
            isKingdomCard: true,
        },
        {
            id: 2,
            name: 'Second Test Card',
            expansions: [testExpansions[1]],
            types: [CardType.Event],
            isKingdomCard: false,
        },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: jasmine.createSpyObj<DataService>('DataService', ['fetchCards']),
                },
                { provide: ExpansionService, useValue: {} },
            ],
        });

        dataServiceSpy = TestBed.inject(DataService);
        expansionServiceSpy = TestBed.inject(ExpansionService);
    });

    describe('cards$', () => {
        it('should map CardDto objects from DataService.cards() to their corresponding Card objects and complete', () => {
            const cardDtos$ = cold('  ----(a|)', { a: testCardDtos });
            const expansions$ = cold('-(a|)   ', { a: testExpansions });
            const expected$ = cold('  ----(a|)', { a: testCards });
            dataServiceSpy.fetchCards.and.returnValue(cardDtos$);
            expansionServiceSpy.expansions$ = expansions$;
            cardService = TestBed.inject(CardService);

            const actual$ = cardService.cards$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('findRandomizableKingdomCards', () => {
        it('should contain only Kingdom cards', () => {
            const kingdomCardDto = { ...defaultTestCardDto, isKingdomCard: true };
            const kingdomCard = { ...kingdomCardDto, expansions: [testExpansions[0]] };
            const nonKingdomCardDto = { ...defaultTestCardDto, isKingdomCard: false };
            const cardDtos$ = cold('  (a|)', { a: [kingdomCardDto, nonKingdomCardDto] });
            const expansions$ = cold('(a|)', { a: testExpansions });
            const expected$ = cold('  (a|)', { a: [kingdomCard] });
            dataServiceSpy.fetchCards.and.returnValue(cardDtos$);
            expansionServiceSpy.expansions$ = expansions$;
            cardService = TestBed.inject(CardService);

            const actual$ = cardService.findRandomizableKingdomCards();

            expect(actual$).toBeObservable(expected$);
        });

        it('should not contain Kingdom cards that are part of a split pile and not on top of it', () => {
            const cardDto = {
                ...defaultTestCardDto,
                isKingdomCard: true,
                isPartOfSplitPile: true,
                isOnTopOfSplitPile: false,
            };
            const cardDtos$ = cold('  (a|)', { a: [cardDto] });
            const expansions$ = cold('(a|)', { a: testExpansions });
            const expected$ = cold('  (a|)', { a: [] });
            dataServiceSpy.fetchCards.and.returnValue(cardDtos$);
            expansionServiceSpy.expansions$ = expansions$;
            cardService = TestBed.inject(CardService);

            const actual$ = cardService.findRandomizableKingdomCards();

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('findByCardType', () => {
        it('should return only cards of given card type and complete', () => {
            const cardDtos$ = cold('  ----(a|)', { a: testCardDtos });
            const expansions$ = cold('(a|)    ', { a: testExpansions });
            const expected$ = cold('  ----(a|)', { a: [testCards[0]] });
            dataServiceSpy.fetchCards.and.returnValue(cardDtos$);
            expansionServiceSpy.expansions$ = expansions$;
            cardService = TestBed.inject(CardService);

            const actual$ = cardService.findByCardType(CardType.Action);

            expect(actual$).toBeObservable(expected$);
        });
    });
});
