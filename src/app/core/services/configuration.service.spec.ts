import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { CardService } from './card.service';
import { Configuration } from '../models/configuration';
import { cold } from 'jasmine-marbles';
import { Expansion } from '../models/expansion';
import { Card } from '../models/card';
import { CardType } from '../models/card-type';
import { Observable } from 'rxjs';

describe('ConfigurationService', () => {
  let configurationService: ConfigurationService;
  let cardServiceSpy: jasmine.SpyObj<CardService>;
  const defaultConfiguration: Configuration = {
    expansions: [],
    options: {
      events: 0,
      landmarks: 0,
      boons: 0,
      hexes: 0,
      states: 0,
    },
    costDistribution: new Map<number, number>(),
  };
  const defaultTestExpansion: Expansion = {
    id: 1,
    name: 'Default Test Expansion',
  };
  const defaultTestCard: Card = {
    id: 1,
    name: 'Default Test Card',
    description: '',
    expansion: defaultTestExpansion,
    types: [CardType.Action],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: CardService,
          useValue: jasmine.createSpyObj<CardService>('CardService', ['findByCardType']),
        },
      ],
    });

    cardServiceSpy = TestBed.get(CardService);
  });

  describe('configuration$', () => {
    it('with service just initialized should emit default configuration', () => {
      const expected$ = cold('a', { a: defaultConfiguration });
      configurationService = TestBed.get(ConfigurationService);

      const actual$ = configurationService.configuration$;

      expect(actual$).toBeObservable(expected$);
    });
  });

  describe('updateExpansions', () => {
    it('should update configuration.expansions', () => {
      const expansions: Expansion[] = [defaultTestExpansion];
      const expected$: Observable<Configuration> =
        cold('a', { a: { ...defaultConfiguration, expansions: expansions }});
      configurationService = TestBed.get(ConfigurationService);

      configurationService.updateExpansions(expansions);
      const actual$ = configurationService.configuration$;

      expect(actual$).toBeObservable(expected$);
    });
  });

  describe('isCardTypeAvailable', () => {
    it('with enabled expansion has card with given card type should return true', () => {
      const cardType: CardType = CardType.Event;
      const enabledExpansion: Expansion = defaultTestExpansion;
      // card.expansion is assigned with copy of enabledExpansion because cards include their own
      // expansion objects
      const card: Card = { ...defaultTestCard, expansion: {...enabledExpansion}, types: [cardType] };
      const cards$: Observable<Card[]> = cold('a', { a: [card] });
      cardServiceSpy.findByCardType.withArgs(cardType).and.returnValue(cards$);
      const expected$ = cold('a', { a: true });
      configurationService = TestBed.get(ConfigurationService);
      configurationService.updateExpansions([enabledExpansion]);

      const actual$ = configurationService.isCardTypeAvailable(cardType);

      expect(actual$).toBeObservable(expected$);
    });

    it('with enabled expansion has no card with given card type should return false', () => {
      const cardType: CardType = CardType.Event;
      const enabledExpansion: Expansion = defaultTestExpansion;
      const disabledExpansion: Expansion = { ...defaultTestExpansion, id: 2 };
      const card: Card = { ...defaultTestCard, expansion: disabledExpansion, types: [cardType] };
      const cards$: Observable<Card[]> = cold('a', { a: [card] });
      cardServiceSpy.findByCardType.withArgs(cardType).and.returnValue(cards$);
      const expected$ = cold('a', { a: false });
      configurationService = TestBed.get(ConfigurationService);
      configurationService.updateExpansions([enabledExpansion]);

      const actual$ = configurationService.isCardTypeAvailable(cardType);

      expect(actual$).toBeObservable(expected$);
    });
  });
});
