import { CardTypeTranslation } from './../models/card-type';
import { TestBed } from '@angular/core/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { DataFixture } from 'src/testing/data-fixture';
import { SpyObj } from 'src/testing/spy-obj';
import { CardType } from '../models/card-type';

import { CardTypeService } from './card-type.service';
import { DataService } from './data.service';
import { TranslationService } from './translation.service';

describe('CardTypeService', () => {
    let cardTypeService: CardTypeService;
    let dataServiceSpy: SpyObj<DataService>;
    let translationServiceSpy: SpyObj<TranslationService>;
    let dataFixture: DataFixture;
    let cardTypes: CardType[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: jasmine.createSpyObj<DataService>('DataService', ['fetchCardTypes']),
                },
                {
                    provide: TranslationService,
                    useValue: jasmine.createSpyObj<TranslationService>('TranslationService', [
                        'getCardTypeTranslations',
                    ]),
                },
            ],
        });

        dataFixture = new DataFixture();
        cardTypes = dataFixture.createCardTypes();

        dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
        translationServiceSpy = TestBed.inject(
            TranslationService,
        ) as jasmine.SpyObj<TranslationService>;
        translationServiceSpy.getCardTypeTranslations.and.returnValue(cold('(a|)', { a: [] }));
    });

    describe('cardTypes$', () => {
        it('with initialization is pending should return from server fetched data after initialization and complete', () => {
            const fetchCardTypes$ = cold('--(a|)', { a: cardTypes });
            const expected$ = cold('      --(a|)', { a: cardTypes });
            dataServiceSpy.fetchCardTypes.and.returnValue(fetchCardTypes$);
            cardTypeService = TestBed.inject(CardTypeService);

            const actual$ = cardTypeService.cardTypes$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with initialization is completed should return cached data immediately and complete', () => {
            const fetchCardTypes$ = cold('--(a|)', { a: cardTypes });
            const expected$ = cold('      (a|)  ', { a: cardTypes });
            dataServiceSpy.fetchCardTypes.and.returnValue(fetchCardTypes$);
            cardTypeService = TestBed.inject(CardTypeService);
            getTestScheduler().flush();
            getTestScheduler().frame = 0;

            const actual$ = cardTypeService.cardTypes$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with translations should return correct translated data and complete', () => {
            const cardTypeTranslations = dataFixture.createCardTypeTranslations(2);
            const cardTypeTranslations$ = cold('---(a|)', { a: cardTypeTranslations });
            translationServiceSpy.getCardTypeTranslations.and.returnValue(cardTypeTranslations$);
            const fetchCardTypes$ = cold('--(a|)', { a: cardTypes });
            dataServiceSpy.fetchCardTypes.and.returnValue(fetchCardTypes$);
            const expected = cardTypes.map((cardType: CardType) => {
                const translation = cardTypeTranslations.find(
                    (cardTypeTranslation: CardTypeTranslation) =>
                        cardTypeTranslation.id === cardType.id,
                );

                if (translation === undefined) {
                    return cardType;
                }

                return {
                    ...cardType,
                    ...translation,
                };
            });
            const expected$ = cold('---(a|)', { a: expected });
            cardTypeService = TestBed.inject(CardTypeService);

            const actual$ = cardTypeService.cardTypes$;

            expect(actual$).toBeObservable(expected$);
        });
    });
});
