import { HttpClient } from '@angular/common/http';
import { SpyObj } from 'src/testing/spy-obj';
import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { cold } from 'jasmine-marbles';
import { LOCALE_ID } from '@angular/core';

describe('DataService', () => {
    let dataService: DataService;
    let httpClientSpy: SpyObj<HttpClient>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HttpClient,
                    useValue: jasmine.createSpyObj<HttpClient>('HttpClient', ['get']),
                },
                {
                    provide: LOCALE_ID,
                    useValue: 'en',
                },
            ],
        });

        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        dataService = TestBed.inject(DataService);
    });

    describe('fetchExpansions', () => {
        it('should make correct HTTP request and return its response data', () => {
            const get$ = cold('--(a|)');
            httpClientSpy.get.withArgs(dataService.expansionsUrl).and.returnValue(get$);

            const actual$ = dataService.fetchExpansions();

            expect(actual$).toBeObservable(get$);
        });
    });

    describe('fetchExpansionTranslations', () => {
        it('with translation file name should make correct HTTP request and return its response data', () => {
            const get$ = cold('--(a|)');
            const translationFileName = 'expansions.german.json';
            httpClientSpy.get
                .withArgs(`${dataService.dataPath}/${translationFileName}`)
                .and.returnValue(get$);

            const actual$ = dataService.fetchExpansionTranslations(translationFileName);

            expect(actual$).toBeObservable(get$);
        });
    });

    describe('fetchCardTypes', () => {
        it('should make correct HTTP request and return its response data', () => {
            const get$ = cold('--(a|)');
            httpClientSpy.get.withArgs(dataService.cardTypesUrl).and.returnValue(get$);

            const actual$ = dataService.fetchCardTypes();

            expect(actual$).toBeObservable(get$);
        });
    });

    describe('fetchCardTypeTranslations', () => {
        it('with translation file name should make correct HTTP request and return its response data', () => {
            const get$ = cold('--(a|)');
            const translationFileName = 'card-types.german.json';
            httpClientSpy.get
                .withArgs(`${dataService.dataPath}/${translationFileName}`)
                .and.returnValue(get$);

            const actual$ = dataService.fetchCardTypeTranslations(translationFileName);

            expect(actual$).toBeObservable(get$);
        });
    });

    describe('fetchCards', () => {
        it('should make correct HTTP request and return its response data', () => {
            const get$ = cold('--(a|)');
            httpClientSpy.get.withArgs(dataService.cardsUrl).and.returnValue(get$);

            const actual$ = dataService.fetchCards();

            expect(actual$).toBeObservable(get$);
        });
    });

    describe('fetchCardTranslations', () => {
        it('with translation file name should make correct HTTP request and return its response data', () => {
            const get$ = cold('--(a|)');
            const translationFileName = 'card.german.json';
            httpClientSpy.get
                .withArgs(`${dataService.dataPath}/${translationFileName}`)
                .and.returnValue(get$);

            const actual$ = dataService.fetchCardTranslations(translationFileName);

            expect(actual$).toBeObservable(get$);
        });
    });
});
