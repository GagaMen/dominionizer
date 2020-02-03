import { TestBed } from '@angular/core/testing';

import { ShuffleService } from './shuffle.service';
import { DataService } from './data.service';
import { ConfigurationService } from './configuration.service';
import { SpyObj } from 'src/testing/spy-obj';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { Configuration } from '../models/configuration';
import { Expansion } from '../models/expansion';
import { Card } from '../models/card';
import { CardType } from '../models/card-type';
import { MathJsService } from './math-js.service';

describe('ShuffleService', () => {
  let shuffleService: ShuffleService;
  let dataServiceSpy: SpyObj<DataService>;
  let configurationServiceSpy: SpyObj<ConfigurationService>;
  let mathJsServiceSpy: SpyObj<MathJsService>;

  const enabledTestExpansion: Expansion = {
    id: 1,
    name: 'Enabled Test Expansion',
  };
  const disabledTestExpansion: Expansion = {
    id: 2,
    name: 'Disabled Test Expansion',
  };
  const firstTestCard: Card = {
    id: 1,
    name: 'First Test Card',
    description: '',
    expansions: [disabledTestExpansion, enabledTestExpansion],
    types: [CardType.Action],
    cost: 4,
  };
  const secondTestCard: Card = {
    id: 2,
    name: 'Second Test Card',
    description: '',
    expansions: [enabledTestExpansion],
    types: [CardType.Action],
    cost: 5,
  };
  const thirdTestCard: Card = {
    id: 3,
    name: 'Third Test Card',
    description: '',
    expansions: [enabledTestExpansion],
    types: [CardType.Action],
    cost: 5,
  };
  const defaultConfiguration: Configuration = {
    expansions: [enabledTestExpansion],
    options: {
      events: 0,
      landmarks: 0,
      boons: 0,
      hexes: 0,
      states: 0,
    },
    costDistribution: new Map<number, number>(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DataService,
          useValue: jasmine.createSpyObj<DataService>('DataService', ['cards']),
        },
        {
          provide: ConfigurationService,
          useValue: {},
        },
        {
          provide: MathJsService,
          useValue: jasmine.createSpyObj<MathJsService>('MathJsService', ['pickRandom']),
        },
      ]
    });

    dataServiceSpy = TestBed.get(DataService);
    dataServiceSpy.cards.and.returnValue(cold('a', { a: [firstTestCard, secondTestCard, thirdTestCard]}));
    configurationServiceSpy = TestBed.get(ConfigurationService);
    configurationServiceSpy.configuration$ = cold('a', { a: defaultConfiguration });
    mathJsServiceSpy = TestBed.get(MathJsService);
    mathJsServiceSpy.pickRandom.and.returnValue([]);
  });

  describe('shuffleCards', () => {
    it('should pass all card ids for selected expansions to MathJsService.pickRandom()', () => {
      const cardIds = [firstTestCard.id, secondTestCard.id, thirdTestCard.id];
      shuffleService = TestBed.get(ShuffleService);

      shuffleService.shuffleCards(1).subscribe(() => {}, fail);
      getTestScheduler().flush();

      expect(mathJsServiceSpy.pickRandom).toHaveBeenCalledWith(cardIds, jasmine.anything(), jasmine.anything());
    });

    it('should pass amount value to MathJsService.pickRandom()', () => {
      const amount = 3;
      shuffleService = TestBed.get(ShuffleService);

      shuffleService.shuffleCards(amount).subscribe(() => {}, fail);
      getTestScheduler().flush();

      expect(mathJsServiceSpy.pickRandom).toHaveBeenCalledWith(jasmine.anything(), amount, jasmine.anything());
    });

    it('should pass correct card weights to MathJsService.pickRandom()', () => {
      const configuration: Configuration = {
        ...defaultConfiguration,
        costDistribution: new Map<number, number>([[4, 1], [5, 2]]),
      };
      configurationServiceSpy.configuration$ = cold('a', { a: configuration });
      // calculation formula: cost distribution value / count of cards with equal cost
      const cardWeights = [1/1, 2/2, 2/2];
      shuffleService = TestBed.get(ShuffleService);

      shuffleService.shuffleCards(1).subscribe(() => {}, fail);
      getTestScheduler().flush();

      expect(mathJsServiceSpy.pickRandom).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), cardWeights);
    });
  });
});
