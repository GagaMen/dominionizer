import { TestBed } from '@angular/core/testing';

import { CardService } from './card.service';
import { DataService } from './data.service';
import { SpyObj } from 'src/testing/spy-obj';
import { CardDto } from '../dtos/card-dto';
import { EditionService } from './edition.service';
import { DataFixture } from 'src/testing/data-fixture';
import { CardType, CardTypeId } from '../models/card-type';
import { CardTypeService } from './card-type.service';
import { Card } from '../models/card';
import { Edition } from '../models/edition';

describe('CardService', () => {
    let cardService: CardService;
    let dataServiceSpy: SpyObj<DataService>;
    let editionServiceSpy: SpyObj<EditionService>;
    let cardTypeServiceSpy: SpyObj<CardTypeService>;
    let dataFixture: DataFixture;
    let editions: Edition[];
    let cardTypes: CardType[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: jasmine.createSpyObj<DataService>('DataService', [
                        'getCards',
                        'getCardTranslations',
                    ]),
                },
                { provide: EditionService, useValue: {} },
                { provide: CardTypeService, useValue: {} },
            ],
        });

        dataFixture = new DataFixture();
        editions = dataFixture.createEditions();
        cardTypes = dataFixture.createCardTypes();

        dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
        dataServiceSpy.getCards.and.returnValue(dataFixture.createCardDtos());
        dataServiceSpy.getCardTranslations.and.returnValue([]);

        editionServiceSpy = TestBed.inject(EditionService);
        editionServiceSpy.editions = editions;

        cardTypeServiceSpy = TestBed.inject(CardTypeService);
        cardTypeServiceSpy.cardTypes = cardTypes;
    });

    describe('cards', () => {
        it('should map CardDto objects to their corresponding Card objects', () => {
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
            dataServiceSpy.getCards.and.returnValue(cardDtos);
            cardService = TestBed.inject(CardService);

            const actual = cardService.cards;

            expect(actual).toEqual(expected);
        });

        it('with translations should return correct translated data', () => {
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
            dataServiceSpy.getCards.and.returnValue([cardDto]);
            dataServiceSpy.getCardTranslations.and.returnValue([cardTranslation]);
            cardService = TestBed.inject(CardService);

            const actual = cardService.cards;

            expect(actual).toEqual(expected);
        });

        it('with translation contains empty name and empty description should return source locale data', () => {
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
            dataServiceSpy.getCards.and.returnValue([cardDto]);
            dataServiceSpy.getCardTranslations.and.returnValue([cardTranslation]);
            cardService = TestBed.inject(CardService);

            const actual = cardService.cards;

            expect(actual).toEqual(expected);
        });
    });

    describe('findRandomizableKingdomCards', () => {
        it('should contain only Kingdom cards', () => {
            const nonKingdomCardDto = dataFixture.createCardDto({ id: '1', isKingdomCard: false });
            const kingdomCardDto = dataFixture.createCardDto({ id: '2', isKingdomCard: true });
            dataServiceSpy.getCards.and.returnValue([nonKingdomCardDto, kingdomCardDto]);
            cardService = TestBed.inject(CardService);
            const expected = [jasmine.objectContaining<Card>({ id: '2' })];

            const actual = cardService.findRandomizableKingdomCards();

            expect(actual).toEqual(expected);
        });

        it('should contain the pile card of a split pile but not its halves', () => {
            // the cargo data marks only the pile itself as a kingdom pile
            const pileCardDto = dataFixture.createCardDto({ id: '1', isKingdomCard: true });
            const halfCardDto = dataFixture.createCardDto({ id: '2', isKingdomCard: false });
            dataServiceSpy.getCards.and.returnValue([pileCardDto, halfCardDto]);
            cardService = TestBed.inject(CardService);
            const expected = [jasmine.objectContaining<Card>({ id: '1' })];

            const actual = cardService.findRandomizableKingdomCards();

            expect(actual).toEqual(expected);
        });
    });

    describe('findByCardType', () => {
        it('should return only cards of given card type', () => {
            cardTypeServiceSpy.cardTypes = [
                dataFixture.createCardType({ id: CardTypeId.Attack }),
                dataFixture.createCardType({ id: CardTypeId.Duration }),
                dataFixture.createCardType({ id: CardTypeId.Action }),
            ];
            const nonActionCardDto = dataFixture.createCardDto({
                id: '1',
                types: [CardTypeId.Attack],
            });
            const actionCardDto = dataFixture.createCardDto({
                id: '2',
                types: [CardTypeId.Duration, CardTypeId.Action],
            });
            dataServiceSpy.getCards.and.returnValue([nonActionCardDto, actionCardDto]);
            cardService = TestBed.inject(CardService);
            const expected = [jasmine.objectContaining<Card>({ id: '2' })];

            const actual = cardService.findByCardType(CardTypeId.Action);

            expect(actual).toEqual(expected);
        });
    });
});
