import { TestBed } from '@angular/core/testing';

import { ShuffleService } from './shuffle.service';
import { ConfigurationService } from './configuration.service';
import { SpyObj } from 'src/testing/spy-obj';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { Configuration } from '../models/configuration';
import { Expansion } from '../models/expansion';
import { Card } from '../models/card';
import { CardType } from '../models/card-type';
import { MathJsService } from './math-js.service';
import { CardService } from './card.service';

describe('ShuffleService', () => {
    let shuffleService: ShuffleService;
    let cardServiceSpy: SpyObj<CardService>;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let mathJsServiceSpy: SpyObj<MathJsService>;

    const enabledTestExpansion: Expansion = {
        id: 1,
        name: 'Enabled Test Expansion',
        icon: '/assets/icons/expansion_icon.png',
    };
    const disabledTestExpansion: Expansion = {
        id: 2,
        name: 'Disabled Test Expansion',
        icon: '/assets/icons/expansion_icon.png',
    };
    const firstTestCard: Card = {
        id: 1,
        name: 'First Test Card',
        expansions: [disabledTestExpansion, enabledTestExpansion],
        types: [CardType.Action],
        isKingdomCard: true,
        cost: 4,
    };
    const secondTestCard: Card = {
        id: 2,
        name: 'Second Test Card',
        expansions: [enabledTestExpansion],
        types: [CardType.Action],
        isKingdomCard: true,
        cost: 5,
    };
    const thirdTestCard: Card = {
        id: 3,
        name: 'Third Test Card',
        expansions: [enabledTestExpansion],
        types: [CardType.Action],
        isKingdomCard: true,
        cost: 5,
    };
    const defaultConfiguration: Configuration = {
        expansions: [enabledTestExpansion],
        options: {
            events: 0,
            landmarks: 0,
            projects: 0,
            ways: 0,
        },
        costDistribution: new Map<number, number>(),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: CardService,
                    useValue: jasmine.createSpyObj<CardService>('CardService', [
                        'findRandomizableKingdomCards',
                        'findByCardType',
                    ]),
                },
                {
                    provide: ConfigurationService,
                    useValue: {},
                },
                {
                    provide: MathJsService,
                    useValue: jasmine.createSpyObj<MathJsService>('MathJsService', [
                        'pickRandomCards',
                    ]),
                },
            ],
        });

        cardServiceSpy = TestBed.inject(CardService) as jasmine.SpyObj<CardService>;
        cardServiceSpy.findRandomizableKingdomCards.and.returnValue(
            cold('a', { a: [firstTestCard, secondTestCard, thirdTestCard] }),
        );
        configurationServiceSpy = TestBed.inject(ConfigurationService) as jasmine.SpyObj<
            ConfigurationService
        >;
        configurationServiceSpy.configuration$ = cold('a', { a: defaultConfiguration });
        mathJsServiceSpy = TestBed.inject(MathJsService) as jasmine.SpyObj<MathJsService>;
        mathJsServiceSpy.pickRandomCards.and.returnValue([]);
    });

    describe('shuffleKingdomCards', () => {
        it('should pass all cards for selected expansions to MathJsService.pickRandomCards()', () => {
            const cards = [firstTestCard, secondTestCard, thirdTestCard];
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleKingdomCards(1).subscribe(null, fail);
            getTestScheduler().flush();

            expect(mathJsServiceSpy.pickRandomCards).toHaveBeenCalledWith(
                cards,
                jasmine.anything(),
                undefined,
            );
        });

        it('should pass amount value to MathJsService.pickRandomCards()', () => {
            const amount = 3;
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleKingdomCards(amount).subscribe(null, fail);
            getTestScheduler().flush();

            expect(mathJsServiceSpy.pickRandomCards).toHaveBeenCalledWith(
                jasmine.anything(),
                amount,
                undefined,
            );
        });

        it('with costDistribution is empty should pass undefined card weights to MathJsService.pickRandomCards()', () => {
            const configuration: Configuration = {
                ...defaultConfiguration,
                costDistribution: new Map<number, number>(),
            };
            configurationServiceSpy.configuration$ = cold('a', { a: configuration });
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleKingdomCards(1).subscribe(null, fail);
            getTestScheduler().flush();

            expect(mathJsServiceSpy.pickRandomCards).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.anything(),
                undefined,
            );
        });

        it('with costDistribution is not empty should pass defined card weights to MathJsService.pickRandomCards()', () => {
            const configuration: Configuration = {
                ...defaultConfiguration,
                costDistribution: new Map<number, number>([
                    [4, 1],
                    [5, 2],
                ]),
            };
            configurationServiceSpy.configuration$ = cold('a', { a: configuration });
            // calculation formula: cost distribution value / count of cards with equal cost
            const cardWeights = [1 / 1, 2 / 2, 2 / 2];
            shuffleService = TestBed.inject(ShuffleService);

            shuffleService.shuffleKingdomCards(1).subscribe(null, fail);
            getTestScheduler().flush();

            expect(mathJsServiceSpy.pickRandomCards).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.anything(),
                cardWeights,
            );
        });
    });
});
