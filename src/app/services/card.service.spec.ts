import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';

import { CardService } from './card.service';
import { DataService } from './data.service';
import { Card } from '../models/card';
import { SpyObj } from 'src/testing/spy-obj';
import { CardDto } from '../dtos/card-dto';
import { Expansion } from '../models/expansion';
import { ExpansionService } from './expansion.service';
import { DataFixture } from 'src/testing/data-fixture';
import { CardTypeId } from '../models/card-type';

describe('CardService', () => {
    let cardService: CardService;
    let dataServiceSpy: SpyObj<DataService>;
    let expansionServiceSpy: SpyObj<ExpansionService>;
    let dataFixture: DataFixture;

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

        dataFixture = new DataFixture();

        dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
        dataServiceSpy.fetchCards.and.returnValue(
            cold('(a|)', { a: dataFixture.createCardDtos() }),
        );
        expansionServiceSpy = TestBed.inject(ExpansionService);
        expansionServiceSpy.expansions$ = cold('(a|)', { a: dataFixture.createExpansions() });
    });

    describe('cards$', () => {
        it('should map CardDto objects from server to their corresponding Card objects and complete', () => {
            // TODO: test for types and dependencies
            const expansions = dataFixture.createExpansions();
            const cardDtos = dataFixture.createCardDtos(3, {
                expansions: [expansions[1].id, expansions[0].id],
            });
            const expected = cardDtos.map((cardDto: CardDto) => {
                return {
                    ...cardDto,
                    expansions: (jasmine.arrayWithExactContents([
                        expansions[1],
                        expansions[0],
                    ]) as unknown) as Expansion[],
                    types: [],
                    dependencies: undefined,
                } as Card;
            });
            const expansions$ = cold('-(a|)   ', { a: expansions });
            const fetchCards$ = cold('----(a|)', { a: cardDtos });
            const expected$ = cold('  ----(a|)', { a: expected });
            expansionServiceSpy.expansions$ = expansions$;
            dataServiceSpy.fetchCards.and.returnValue(fetchCards$);
            cardService = TestBed.inject(CardService);

            const actual$ = cardService.cards$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('findRandomizableKingdomCards', () => {
        it('should contain only Kingdom cards', () => {
            const nonKingdomCard = dataFixture.createCard({ isKingdomCard: false });
            const kingdomCard = dataFixture.createCard({ isKingdomCard: true });
            const cards$ = cold('   (a|)', { a: [nonKingdomCard, kingdomCard] });
            const expected$ = cold('(a|)', { a: [kingdomCard] });
            cardService = TestBed.inject(CardService);
            spyOnProperty(cardService, 'cards$').and.returnValue(cards$);

            const actual$ = cardService.findRandomizableKingdomCards();

            expect(actual$).toBeObservable(expected$);
        });

        // TODO: respect split piles
        xit('should not contain Kingdom cards that are part of a split pile and not on top of it', () => {
            const card = dataFixture.createCard({
                isKingdomCard: true,
            });
            const cards$ = cold('   (a|)', { a: [card] });
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
                types: [dataFixture.createCardType({ id: CardTypeId.Attack })],
            });
            const actionCard = dataFixture.createCard({
                types: [
                    dataFixture.createCardType({ id: CardTypeId.Duration }),
                    dataFixture.createCardType({ id: CardTypeId.Action }),
                ],
            });
            const cards$ = cold('   (a|)', { a: [nonActionCard, actionCard] });
            const expected$ = cold('(a|)', { a: [actionCard] });
            cardService = TestBed.inject(CardService);
            spyOnProperty(cardService, 'cards$').and.returnValue(cards$);

            const actual$ = cardService.findByCardType(CardTypeId.Action);

            expect(actual$).toBeObservable(expected$);
        });
    });
});
