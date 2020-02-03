import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';

import { CardService } from './card.service';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { Card } from '../models/card';
import { CardType } from '../models/card-type';

describe('CardService', () => {
  let cardService: CardService;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  const events: Card[] = [
    { id: 1001, name: 'Alms', description: '', expansions: [{ id: 11, name: 'Adventures' }], types: [CardType.Event] },
    { id: 1002, name: 'Borrow', description: '', expansions: [{ id: 11, name: 'Adventures' }], types: [CardType.Event] },
  ];
  const landmarks: Card[] = [
    { id: 2001, name: 'Aqueduct', description: '', expansions: [{ id: 12, name: 'Empires' }], types: [15] },
    { id: 2002, name: 'Arena', description: '', expansions: [{ id: 12, name: 'Empires' }], types: [15] },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CardService,
        {
          provide: DataService,
          useValue: jasmine.createSpyObj<DataService>(
            'DataService',
            ['cards', 'events', 'landmarks', 'boons', 'hexes', 'states']
          ),
        }
      ]
    });

    dataServiceSpy = TestBed.get(DataService);

    const emptyCards$: Observable<Card[]> = cold('(a|)', { a: [] });
    dataServiceSpy.cards.and.returnValue(emptyCards$);
    dataServiceSpy.events.and.returnValue(emptyCards$);
    dataServiceSpy.landmarks.and.returnValue(emptyCards$);
    dataServiceSpy.boons.and.returnValue(emptyCards$);
    dataServiceSpy.hexes.and.returnValue(emptyCards$);
    dataServiceSpy.states.and.returnValue(emptyCards$);
  });

  describe('findByCardType', () => {
    it('should return only cards of given card type', () => {
      const events$: Observable<Card[]> = cold('   (a|)', { a: events });
      const landmarks$: Observable<Card[]> = cold('(a|)', { a: landmarks });
      const expected$: Observable<Card[]> = cold(' (a|)', { a: events });
      dataServiceSpy.events.and.returnValue(events$);
      dataServiceSpy.landmarks.and.returnValue(landmarks$);
      cardService = TestBed.get(CardService);

      const actual$ = cardService.findByCardType(CardType.Event);

      expect(actual$).toBeObservable(expected$)
    });

    it('should return only after all cards were loaded', () => {
      const events$: Observable<Card[]> = cold('   -(a|)', { a: events });
      const landmarks$: Observable<Card[]> = cold('---(a|)', { a: landmarks });
      const expected$: Observable<Card[]> = cold(' ---(a|)', { a: events });
      dataServiceSpy.events.and.returnValue(events$);
      dataServiceSpy.landmarks.and.returnValue(landmarks$);
      cardService = TestBed.get(CardService);

      const actual$ = cardService.findByCardType(CardType.Event);

      expect(actual$).toBeObservable(expected$);
    });
  });
});
