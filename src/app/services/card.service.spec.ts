import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';

import { CardService } from './card.service';
import { DataService } from './data.service';
import { SpyObj } from 'src/testing/spy-obj';
import { CardDto } from '../dtos/card-dto';
import { EditionService } from './edition.service';
import { DataFixture } from 'src/testing/data-fixture';
import { CardTypeId } from '../models/card-type';
import { CardTypeService } from './card-type.service';
import { Card } from '../models/card';

describe('CardService', () => {
    let cardService: CardService;
    let dataServiceSpy: SpyObj<DataService>;
    let editionServiceSpy: SpyObj<EditionService>;
    let cardTypeServiceSpy: SpyObj<CardTypeService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: jasmine.createSpyObj<DataService>('DataService', [
                        'fetchCards',
                        'fetchCardTranslations',
                    ]),
                },
                { provide: EditionService, useValue: {} },
                { provide: CardTypeService, useValue: {} },
            ],
        });

        dataFixture = new DataFixture();

        dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
        dataServiceSpy.fetchCards.and.returnValue(
            cold('(a|)', { a: dataFixture.createCardDtos() }),
        );
        dataServiceSpy.fetchCardTranslations.and.returnValue(cold('(a|)', { a: [] }));

        editionServiceSpy = TestBed.inject(EditionService);
        editionServiceSpy.editions$ = cold('(a|)', { a: dataFixture.createEditions() });

        cardTypeServiceSpy = TestBed.inject(CardTypeService);
        cardTypeServiceSpy.cardTypes$ = cold('(a|)', { a: dataFixture.createCardTypes() });
    });

    describe('cards$', () => {
        it('should map CardDto objects from server to their corresponding Card objects and complete', () => {
            const editions = dataFixture.createEditions();
            const cardTypes = dataFixture.createCardTypes();
            const cardDtos = dataFixture.createCardDtos(3, {
                editions: [editions[0].id, editions[2].id],
                types: [cardTypes[0].id, cardTypes[2].id],
            });
            const expected = new Map<string, Card>();
            cardDtos.forEach((cardDto: CardDto) => {
                expected.set(cardDto.id, {
                    ...cardDto,
                    editions: [editions[0], editions[2]],
                    types: [cardTypes[0], cardTypes[2]],
                });
            });
            const editions$ = cold('  -(a|)   ', { a: editions });
            const cardTypes$ = cold(' -(b|)   ', { b: cardTypes });
            const fetchCards$ = cold('----(c|)', { c: cardDtos });
            const expected$ = cold('  ----(d|)', { d: expected });
            editionServiceSpy.editions$ = editions$;
            cardTypeServiceSpy.cardTypes$ = cardTypes$;
            dataServiceSpy.fetchCards.and.returnValue(fetchCards$);
            cardService = TestBed.inject(CardService);

            const actual$ = cardService.cards$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with translations should return correct translated data and complete', () => {
            const editions = dataFixture.createEditions(2);
            const cardTypes = dataFixture.createCardTypes(2);
            const cardDto = dataFixture.createCardDto({
                id: '1',
                editions: [editions[0].id, editions[1].id],
                types: [cardTypes[0].id, cardTypes[1].id],
            });
            const cardTranslation = dataFixture.createCardTranslation({ id: '1' });
            const expected = new Map<string, Card>();
            expected.set('1', {
                ...cardDto,
                name: cardTranslation.name,
                description: cardTranslation.description,
                editions: [editions[0], editions[1]],
                types: [cardTypes[0], cardTypes[1]],
            });
            const editions$ = cold('  -(a|)   ', { a: editions });
            const cardTypes$ = cold(' -(b|)   ', { b: cardTypes });
            const fetchCards$ = cold('----(c|)', { c: [cardDto] });
            const cardTranslations$ = cold('---(a|)', { a: [cardTranslation] });
            const expected$ = cold('  ----(d|)', { d: expected });
            editionServiceSpy.editions$ = editions$;
            cardTypeServiceSpy.cardTypes$ = cardTypes$;
            dataServiceSpy.fetchCards.and.returnValue(fetchCards$);
            dataServiceSpy.fetchCardTranslations.and.returnValue(cardTranslations$);
            cardService = TestBed.inject(CardService);

            const actual$ = cardService.cards$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with translation contains empty name and empty description should return source locale data and complete', () => {
            const editions = dataFixture.createEditions(2);
            const cardTypes = dataFixture.createCardTypes(2);
            const cardDto = dataFixture.createCardDto({
                id: '1',
                editions: [editions[0].id, editions[1].id],
                types: [cardTypes[0].id, cardTypes[1].id],
            });
            const cardTranslation = dataFixture.createCardTranslation({
                id: '1',
                name: '',
                description: '',
            });
            const expected = new Map<string, Card>();
            expected.set('1', {
                ...cardDto,
                editions: [editions[0], editions[1]],
                types: [cardTypes[0], cardTypes[1]],
            });
            const editions$ = cold('  -(a|)   ', { a: editions });
            const cardTypes$ = cold(' -(b|)   ', { b: cardTypes });
            const fetchCards$ = cold('----(c|)', { c: [cardDto] });
            const cardTranslations$ = cold('---(a|)', { a: [cardTranslation] });
            const expected$ = cold('  ----(d|)', { d: expected });
            editionServiceSpy.editions$ = editions$;
            cardTypeServiceSpy.cardTypes$ = cardTypes$;
            dataServiceSpy.fetchCards.and.returnValue(fetchCards$);
            dataServiceSpy.fetchCardTranslations.and.returnValue(cardTranslations$);
            cardService = TestBed.inject(CardService);

            const actual$ = cardService.cards$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('findRandomizableKingdomCards', () => {
        it('should contain only Kingdom cards', () => {
            const nonKingdomCard = dataFixture.createCard({ id: '1', isKingdomCard: false });
            const kingdomCard = dataFixture.createCard({ id: '2', isKingdomCard: true });
            const cards$ = cold('   (a|)', {
                a: new Map([
                    ['1', nonKingdomCard],
                    ['2', kingdomCard],
                ]),
            });
            const expected$ = cold('(a|)', { a: [kingdomCard] });
            cardService = TestBed.inject(CardService);
            spyOnProperty(cardService, 'cards$').and.returnValue(cards$);

            const actual$ = cardService.findRandomizableKingdomCards();

            expect(actual$).toBeObservable(expected$);
        });

        it('should contain the pile card of a split pile but not its halves', () => {
            // the cargo data marks only the pile itself as a kingdom pile
            const pileCard = dataFixture.createCard({ id: '1', isKingdomCard: true });
            const halfCard = dataFixture.createCard({ id: '2', isKingdomCard: false });
            const cards$ = cold('   (a|)', {
                a: new Map([
                    ['1', pileCard],
                    ['2', halfCard],
                ]),
            });
            const expected$ = cold('(a|)', { a: [pileCard] });
            cardService = TestBed.inject(CardService);
            spyOnProperty(cardService, 'cards$').and.returnValue(cards$);

            const actual$ = cardService.findRandomizableKingdomCards();

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('findByCardType', () => {
        it('should return only cards of given card type and complete', () => {
            const nonActionCard = dataFixture.createCard({
                id: '1',
                types: [dataFixture.createCardType({ id: CardTypeId.Attack })],
            });
            const actionCard = dataFixture.createCard({
                id: '2',
                types: [
                    dataFixture.createCardType({ id: CardTypeId.Duration }),
                    dataFixture.createCardType({ id: CardTypeId.Action }),
                ],
            });
            const cards$ = cold('   (a|)', {
                a: new Map([
                    ['1', nonActionCard],
                    ['2', actionCard],
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
