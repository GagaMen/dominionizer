import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { SpyObj } from 'src/testing/spy-obj';
import { cold } from 'jasmine-marbles';
import { MathService } from './math.service';
import { CardService } from './card.service';
import { DataFixture } from 'src/testing/data-fixture';

describe('ShuffleService', () => {
    let cardServiceSpy: SpyObj<CardService>;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let mathServiceSpy: SpyObj<MathService>;
    let dataFixture: DataFixture;

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
                    provide: MathService,
                    useValue: jasmine.createSpyObj<MathService>('MathService', ['pickRandomCards']),
                },
            ],
        });

        dataFixture = new DataFixture();
        cardServiceSpy = TestBed.inject(CardService) as jasmine.SpyObj<CardService>;
        cardServiceSpy.findRandomizableKingdomCards.and.returnValue(
            cold('a', { a: dataFixture.createCards(3, { isKingdomCard: true }) }),
        );
        configurationServiceSpy = TestBed.inject(ConfigurationService) as jasmine.SpyObj<
            ConfigurationService
        >;
        configurationServiceSpy.configuration$ = cold('a', {
            a: dataFixture.createConfiguration(),
        });
        mathServiceSpy = TestBed.inject(MathService) as jasmine.SpyObj<MathService>;
        mathServiceSpy.pickRandomCards.and.returnValue([]);
    });

    // describe('shuffleKingdomCards', () => {
    //     it('should pass all cards for selected expansions to MathService.pickRandomCards()', () => {
    //         const cards = [firstTestCard, secondTestCard, thirdTestCard];
    //         shuffleService = TestBed.inject(ShuffleService);

    //         shuffleService.shuffleKingdomCards(1).subscribe(null, fail);
    //         getTestScheduler().flush();

    //         expect(mathServiceSpy.pickRandomCards).toHaveBeenCalledWith(
    //             cards,
    //             jasmine.anything(),
    //             undefined,
    //         );
    //     });

    //     it('should pass amount value to MathService.pickRandomCards()', () => {
    //         const amount = 3;
    //         shuffleService = TestBed.inject(ShuffleService);

    //         shuffleService.shuffleKingdomCards(amount).subscribe(null, fail);
    //         getTestScheduler().flush();

    //         expect(mathServiceSpy.pickRandomCards).toHaveBeenCalledWith(
    //             jasmine.anything(),
    //             amount,
    //             undefined,
    //         );
    //     });

    //     it('with costDistribution is empty should pass undefined card weights to MathService.pickRandomCards()', () => {
    //         const configuration: Configuration = {
    //             ...defaultConfiguration,
    //             costDistribution: new Map<number, number>(),
    //         };
    //         configurationServiceSpy.configuration$ = cold('a', { a: configuration });
    //         shuffleService = TestBed.inject(ShuffleService);

    //         shuffleService.shuffleKingdomCards(1).subscribe(null, fail);
    //         getTestScheduler().flush();

    //         expect(mathServiceSpy.pickRandomCards).toHaveBeenCalledWith(
    //             jasmine.anything(),
    //             jasmine.anything(),
    //             undefined,
    //         );
    //     });

    //     it('with costDistribution is not empty should pass defined card weights to MathService.pickRandomCards()', () => {
    //         const configuration: Configuration = {
    //             ...defaultConfiguration,
    //             costDistribution: new Map<number, number>([
    //                 [4, 1],
    //                 [5, 2],
    //             ]),
    //         };
    //         configurationServiceSpy.configuration$ = cold('a', { a: configuration });
    //         // calculation formula: cost distribution value / count of cards with equal cost
    //         const cardWeights = [1 / 1, 2 / 2, 2 / 2];
    //         shuffleService = TestBed.inject(ShuffleService);

    //         shuffleService.shuffleKingdomCards(1).subscribe(null, fail);
    //         getTestScheduler().flush();

    //         expect(mathServiceSpy.pickRandomCards).toHaveBeenCalledWith(
    //             jasmine.anything(),
    //             jasmine.anything(),
    //             cardWeights,
    //         );
    //     });
    // });
});
