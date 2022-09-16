import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';

import { DependencyType } from './../models/dependency';
import { CardService } from './card.service';
import { DataService } from './data.service';
import { SpyObj } from 'src/testing/spy-obj';
import { CardDto } from '../dtos/card-dto';
import { ExpansionService } from './expansion.service';
import { DataFixture } from 'src/testing/data-fixture';
import { CardTypeId } from '../models/card-type';
import { CardTypeService } from './card-type.service';
import { Card } from '../models/card';

describe('CardService', () => {
    let cardService: CardService;
    let dataServiceSpy: SpyObj<DataService>;
    let expansionServiceSpy: SpyObj<ExpansionService>;
    let cardTypeServiceSpy: SpyObj<CardTypeService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: jasmine.createSpyObj<DataService>('DataService', ['fetchCards']),
                },
                { provide: ExpansionService, useValue: {} },
                { provide: CardTypeService, useValue: {} },
            ],
        });

        dataFixture = new DataFixture();

        dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
        dataServiceSpy.fetchCards.and.returnValue(
            cold('(a|)', { a: dataFixture.createCardDtos() }),
        );

        expansionServiceSpy = TestBed.inject(ExpansionService);
        expansionServiceSpy.expansions$ = cold('(a|)', { a: dataFixture.createExpansions() });

        cardTypeServiceSpy = TestBed.inject(CardTypeService);
        cardTypeServiceSpy.cardTypes$ = cold('(a|)', { a: dataFixture.createCardTypes() });
    });

    describe('cards$', () => {
        it('should map CardDto objects from server to their corresponding Card objects and complete', () => {
            const expansions = dataFixture.createExpansions();
            const cardTypes = dataFixture.createCardTypes();
            const cardDtos = dataFixture.createCardDtos(3, {
                expansions: [expansions[0].id, expansions[2].id],
                types: [cardTypes[0].id, cardTypes[2].id],
            });
            cardDtos[0].dependencies = [
                { id: cardDtos[0].id, type: DependencyType.SplitPile },
                { id: cardDtos[1].id, type: DependencyType.SplitPile },
            ];
            cardDtos[1].dependencies = [{ id: cardDtos[0].id, type: DependencyType.SplitPile }];
            const expected: Map<number, Card> = new Map();
            cardDtos.forEach((cardDto: CardDto) => {
                expected.set(cardDto.id, {
                    ...cardDto,
                    expansions: [expansions[0], expansions[2]],
                    types: [cardTypes[0], cardTypes[2]],
                    dependencies: undefined,
                });
            });
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expected.get(cardDtos[0].id)!.dependencies = [
                {
                    card: expected.get(cardDtos[0].id) as Card,
                    type: DependencyType.SplitPile,
                },
                {
                    card: expected.get(cardDtos[1].id) as Card,
                    type: DependencyType.SplitPile,
                },
            ];
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expected.get(cardDtos[1].id)!.dependencies = [
                {
                    card: expected.get(cardDtos[0].id) as Card,
                    type: DependencyType.SplitPile,
                },
            ];
            const expansions$ = cold('-(a|)   ', { a: expansions });
            const cardTypes$ = cold(' -(b|)   ', { b: cardTypes });
            const fetchCards$ = cold('----(c|)', { c: cardDtos });
            const expected$ = cold('  ----(d|)', { d: expected });
            expansionServiceSpy.expansions$ = expansions$;
            cardTypeServiceSpy.cardTypes$ = cardTypes$;
            dataServiceSpy.fetchCards.and.returnValue(fetchCards$);
            cardService = TestBed.inject(CardService);

            const actual$ = cardService.cards$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('findRandomizableKingdomCards', () => {
        it('should contain only Kingdom cards', () => {
            const nonKingdomCard = dataFixture.createCard({ id: 1, isKingdomCard: false });
            const kingdomCard = dataFixture.createCard({ id: 2, isKingdomCard: true });
            const cards$ = cold('   (a|)', {
                a: new Map([
                    [1, nonKingdomCard],
                    [2, kingdomCard],
                ]),
            });
            const expected$ = cold('(a|)', { a: [kingdomCard] });
            cardService = TestBed.inject(CardService);
            spyOnProperty(cardService, 'cards$').and.returnValue(cards$);

            const actual$ = cardService.findRandomizableKingdomCards();

            expect(actual$).toBeObservable(expected$);
        });

        it('should not contain Kingdom cards that are part of a split pile and not on top of it', () => {
            const card = dataFixture.createCard({
                id: 2,
                isKingdomCard: true,
                dependencies: [{ card: { id: 1 } as Card, type: DependencyType.SplitPile }],
            });
            const cards$ = cold('   (a|)', { a: new Map([[2, card]]) });
            const expected$ = cold('(a|)', { a: [] });
            cardService = TestBed.inject(CardService);
            spyOnProperty(cardService, 'cards$').and.returnValue(cards$);

            const actual$ = cardService.findRandomizableKingdomCards();

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('findByCardType', () => {
        it('should return only cards of given card type and complete', () => {
            const nonActionCard = dataFixture.createCard({
                id: 1,
                types: [dataFixture.createCardType({ id: CardTypeId.Attack })],
            });
            const actionCard = dataFixture.createCard({
                id: 2,
                types: [
                    dataFixture.createCardType({ id: CardTypeId.Duration }),
                    dataFixture.createCardType({ id: CardTypeId.Action }),
                ],
            });
            const cards$ = cold('   (a|)', {
                a: new Map([
                    [1, nonActionCard],
                    [2, actionCard],
                ]),
            });
            const expected$ = cold('(a|)', { a: [actionCard] });
            cardService = TestBed.inject(CardService);
            spyOnProperty(cardService, 'cards$').and.returnValue(cards$);

            const actual$ = cardService.findByCardType(CardTypeId.Action);

            expect(actual$).toBeObservable(expected$);
        });
    });
});
