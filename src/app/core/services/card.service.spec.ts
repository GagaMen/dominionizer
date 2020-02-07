import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';

import { CardService } from './card.service';
import { DataService } from './data.service';
import { Observable, NEVER, EMPTY } from 'rxjs';
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

  const testCardDtos: CardDto[] = [
    { id: 1, name: 'First Test Card', expansions: [1, 2], types: [CardType.Action]},
    { id: 2, name: 'Second Test Card', expansions: [2], types: [CardType.Event]},
  ];
  const testExpansions: Expansion[] = [
    { id: 1, name: 'First Test Expansion' },
    { id: 2, name: 'Second Test Expansion' },
  ];
  const testCards: Card[] = [
    { id: 1, name: 'First Test Card', expansions: [testExpansions[0], testExpansions[1]], types: [CardType.Action]},
    { id: 2, name: 'Second Test Card', expansions: [testExpansions[1]], types: [CardType.Event]},
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DataService,
          useValue: jasmine.createSpyObj<DataService>('DataService', ['cards']),
        },
        { provide: ExpansionService, useValue: {} },
      ]
    });

    dataServiceSpy = TestBed.get(DataService);
    expansionServiceSpy = TestBed.get(ExpansionService);
  });

  describe('cards$', () => {
    it('with called the first time should return immediately an empty array', () => {
      const expected$ = cold('a---', { a: [] });
      dataServiceSpy.cards.and.returnValue(NEVER);
      expansionServiceSpy.expansions$ = NEVER;
      cardService = TestBed.get(CardService);

      const actual$ = cardService.cards$;

      expect(actual$).toBeObservable(expected$);
    });

    it('with DataService.cards() and ExpansionService.expansions$ complete should never complete', () => {
      const expected$ = cold('a---', { a: [] });
      dataServiceSpy.cards.and.returnValue(EMPTY);
      expansionServiceSpy.expansions$ = EMPTY;
      cardService = TestBed.get(CardService);

      const actual$ = cardService.cards$;

      expect(actual$).toBeObservable(expected$);
    });

    it('should map CardDto objects from DataService.cards() to their corresponding Card objects', () => {
      const cardDtos$ = cold('  ----(b|)', { b: testCardDtos });
      const expansions$ = cold('a--b----', { a: [], b: testExpansions });
      const expected$ = cold('  a---b---', { a: [], b: testCards });
      dataServiceSpy.cards.and.returnValue(cardDtos$);
      expansionServiceSpy.expansions$ = expansions$;
      cardService = TestBed.get(CardService);

      const actual$ = cardService.cards$;

      expect(actual$).toBeObservable(expected$);
    });

    it('with ExpansionService.expansions$ returns empty array should return empty array', () => {
      const cardDtos$ = cold('  --(b|)', { b: testCardDtos });
      const expansions$ = cold('a----b----', { a: [], b: [] });
      const expected$ = cold('  a---------', { a: [] });
      dataServiceSpy.cards.and.returnValue(cardDtos$);
      expansionServiceSpy.expansions$ = expansions$;
      cardService = TestBed.get(CardService);

      const actual$ = cardService.cards$;

      expect(actual$).toBeObservable(expected$);
    });
  });

  describe('findByCardType', () => {
    it('should return only cards of given card type', () => {
      const cardDtos$ = cold('  ----(b|)', { b: testCardDtos });
      const expansions$ = cold('a--b----', { a: [], b: testExpansions });
      const expected$ = cold('  a---b---', { a: [], b: [testCards[0]] });
      dataServiceSpy.cards.and.returnValue(cardDtos$);
      expansionServiceSpy.expansions$ = expansions$;
      cardService = TestBed.get(CardService);

      const actual$ = cardService.findByCardType(CardType.Action);

      expect(actual$).toBeObservable(expected$);
    });
  });
});
