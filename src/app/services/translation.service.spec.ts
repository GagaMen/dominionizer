import { CardTypeTranslation } from './../models/card-type';
import { ExpansionTranslation } from './../models/expansion';
import { cold } from 'jasmine-marbles';
import { CardTranslation } from './../models/card';
import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';
import { DataFixture } from 'src/testing/data-fixture';
import { DataService } from './data.service';
import { SpyObj } from 'src/testing/spy-obj';
import { LOCALE_ID } from '@angular/core';

describe('TranslationService', () => {
    let translationService: TranslationService;
    let dataServiceSpy: SpyObj<DataService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: LOCALE_ID,
                    useValue: 'de',
                },
                {
                    provide: DataService,
                    useValue: jasmine.createSpyObj<DataService>('DataService', [
                        'fetchExpansionTranslations',
                        'fetchCardTypeTranslations',
                        'fetchCardTranslations',
                    ]),
                },
            ],
        });

        dataFixture = new DataFixture();
    });

    describe('getExpansionTranslations', () => {
        it('should return correct expansion translations', () => {
            const expansionTranslations: ExpansionTranslation[] =
                dataFixture.createExpansionTranslations(10);
            const fetchExpansionTranslations$ = cold('-(a|)', { a: expansionTranslations });
            const expected$ = cold('-(b|)', { b: expansionTranslations });
            dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
            dataServiceSpy.fetchExpansionTranslations
                .withArgs('expansions.german.json')
                .and.returnValue(fetchExpansionTranslations$);
            translationService = TestBed.inject(TranslationService);

            const actual$ = translationService.getExpansionTranslations();

            expect(actual$).toBeObservable(expected$);
        });

        it('with unknown locale should return empty array', () => {
            TestBed.overrideProvider(LOCALE_ID, { useValue: 'en' });
            const expected$ = cold('(a|)', { a: [] });
            translationService = TestBed.inject(TranslationService);

            const actual$ = translationService.getExpansionTranslations();

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('getCardTypeTranslations', () => {
        it('should return correct card translations', () => {
            const cardTypeTranslations: CardTypeTranslation[] =
                dataFixture.createCardTypeTranslations(10);
            const fetchCardTypeTranslations$ = cold('-(a|)', { a: cardTypeTranslations });
            const expected$ = cold('-(b|)', { b: cardTypeTranslations });
            dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
            dataServiceSpy.fetchCardTypeTranslations
                .withArgs('card-types.german.json')
                .and.returnValue(fetchCardTypeTranslations$);
            translationService = TestBed.inject(TranslationService);

            const actual$ = translationService.getCardTypeTranslations();

            expect(actual$).toBeObservable(expected$);
        });

        it('with unknown locale should return empty array', () => {
            TestBed.overrideProvider(LOCALE_ID, { useValue: 'en' });
            const expected$ = cold('(a|)', { a: [] });
            translationService = TestBed.inject(TranslationService);

            const actual$ = translationService.getCardTypeTranslations();

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('getCardTranslations', () => {
        it('should return correct card translations', () => {
            const cardTranslations: CardTranslation[] = dataFixture.createCardTranslations(10);
            const fetchCardTranslations$ = cold('-(a|)', { a: cardTranslations });
            const expected$ = cold('-(b|)', { b: cardTranslations });
            dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
            dataServiceSpy.fetchCardTranslations
                .withArgs('cards.german.json')
                .and.returnValue(fetchCardTranslations$);
            translationService = TestBed.inject(TranslationService);

            const actual$ = translationService.getCardTranslations();

            expect(actual$).toBeObservable(expected$);
        });

        it('with unknown locale should return empty array', () => {
            TestBed.overrideProvider(LOCALE_ID, { useValue: 'en' });
            const expected$ = cold('(a|)', { a: [] });
            translationService = TestBed.inject(TranslationService);

            const actual$ = translationService.getCardTranslations();

            expect(actual$).toBeObservable(expected$);
        });
    });
});
