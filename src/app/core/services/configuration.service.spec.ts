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
  const enabledTestExpansion: Expansion = {
    id: 1,
    name: 'Enabled Test Expansion',
  };
  const disabledTestExpansion: Expansion = {
    id: 2,
    name: 'Disabled Test Expansion',
  };
  const defaultTestCard: Card = {
    id: 1,
    name: 'Default Test Card',
    expansions: [disabledTestExpansion, enabledTestExpansion],
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
      const expected$ = cold('a', { a: ConfigurationService.defaultConfiguration });
      configurationService = TestBed.get(ConfigurationService);

      const actual$ = configurationService.configuration$;

      expect(actual$).toBeObservable(expected$);
    });
  });

  describe('updateExpansions', () => {
    it('should update configuration.expansions', () => {
      const expansions: Expansion[] = [enabledTestExpansion];
      const expected$: Observable<Configuration> =
        cold('a', { a: { ...ConfigurationService.defaultConfiguration, expansions: expansions }});
      configurationService = TestBed.get(ConfigurationService);

      configurationService.updateExpansions(expansions);
      const actual$ = configurationService.configuration$;

      expect(actual$).toBeObservable(expected$);
    });
  });

  describe('isCardTypeAvailable', () => {
    it('with enabled expansion has card with given card type should return true', () => {
      const cardType: CardType = CardType.Event;
      const card: Card = { ...defaultTestCard, expansions: [disabledTestExpansion, enabledTestExpansion], types: [cardType] };
      const cards$: Observable<Card[]> = cold('a', { a: [card] });
      cardServiceSpy.findByCardType.withArgs(cardType).and.returnValue(cards$);
      const expected$ = cold('a', { a: true });
      configurationService = TestBed.get(ConfigurationService);
      configurationService.updateExpansions([enabledTestExpansion]);

      const actual$ = configurationService.isCardTypeAvailable(cardType);

      expect(actual$).toBeObservable(expected$);
    });

    it('with enabled expansion has no card with given card type should return false', () => {
      const cardType: CardType = CardType.Event;
      const card: Card = { ...defaultTestCard, expansions: [disabledTestExpansion], types: [cardType] };
      const cards$: Observable<Card[]> = cold('a', { a: [card] });
      cardServiceSpy.findByCardType.withArgs(cardType).and.returnValue(cards$);
      const expected$ = cold('a', { a: false });
      configurationService = TestBed.get(ConfigurationService);
      configurationService.updateExpansions([enabledTestExpansion]);

      const actual$ = configurationService.isCardTypeAvailable(cardType);

      expect(actual$).toBeObservable(expected$);
    });
  });
});
