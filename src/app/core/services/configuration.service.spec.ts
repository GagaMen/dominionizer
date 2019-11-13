import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { CardService } from './card.service';
import { Configuration } from '../models/configuration';
import { cold } from 'jasmine-marbles';
import { Extension } from '../models/extension';
import { Card } from '../models/card';
import { CardType } from '../models/card-type';
import { Observable } from 'rxjs';

describe('ConfigurationService', () => {
  let configurationService: ConfigurationService;
  let cardServiceSpy: jasmine.SpyObj<CardService>;
  const defaultConfiguration: Configuration = {
    extensions: [],
    options: {
      events: 0,
      landmarks: 0,
      boons: 0,
      hexes: 0,
      states: 0,
      reactionOnAttack: false,
    },
  };
  const defaultTestExtension: Extension = {
    id: 1,
    name: 'Default Test Extension',
  };
  const defaultTestCard: Card = {
    id: 1,
    name: 'Default Test Card',
    description: '',
    extension: defaultTestExtension,
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

  describe('updateExtensions', () => {
    it('should update configuration.extensions', () => {
      const extensions: Extension[] = [defaultTestExtension];
      const expected$: Observable<Configuration> =
        cold('a', { a: { ...defaultConfiguration, extensions: extensions }});
      configurationService = TestBed.get(ConfigurationService);

      configurationService.updateExtensions(extensions);
      const actual$ = configurationService.configuration$;

      expect(actual$).toBeObservable(expected$);
    });
  });

  describe('isCardTypeAvailable', () => {
    it('with enabled extension has card with given card type should return true', () => {
      const cardType: CardType = CardType.Event;
      const enabledExtension: Extension = defaultTestExtension;
      // card.extension is assigned with copy of enabledExtension because cards include their own
      // extension objects
      const card: Card = { ...defaultTestCard, extension: {...enabledExtension}, types: [cardType] };
      const cards$: Observable<Card[]> = cold('a', { a: [card] });
      cardServiceSpy.findByCardType.withArgs(cardType).and.returnValue(cards$);
      const expected$ = cold('a', { a: true });
      configurationService = TestBed.get(ConfigurationService);
      configurationService.updateExtensions([enabledExtension]);

      const actual$ = configurationService.isCardTypeAvailable(cardType);

      expect(actual$).toBeObservable(expected$);
    });

    it('with enabled extension has no card with given card type should return false', () => {
      const cardType: CardType = CardType.Event;
      const enabledExtension: Extension = defaultTestExtension;
      const disabledExtension: Extension = { ...defaultTestExtension, id: 2 };
      const card: Card = { ...defaultTestCard, extension: disabledExtension, types: [cardType] };
      const cards$: Observable<Card[]> = cold('a', { a: [card] });
      cardServiceSpy.findByCardType.withArgs(cardType).and.returnValue(cards$);
      const expected$ = cold('a', { a: false });
      configurationService = TestBed.get(ConfigurationService);
      configurationService.updateExtensions([enabledExtension]);

      const actual$ = configurationService.isCardTypeAvailable(cardType);

      expect(actual$).toBeObservable(expected$);
    });
  });
});
