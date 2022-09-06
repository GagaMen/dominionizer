import { HttpClient } from '@angular/common/http';
import { SpyObj } from 'src/testing/spy-obj';
import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { cold } from 'jasmine-marbles';

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
            ],
        });

        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        dataService = TestBed.inject(DataService);
    });

    describe('fetchExpansions', () => {
        it('should make correct HTTP request and return its response data', () => {
            const get$ = cold('--(a|)');
            httpClientSpy.get.withArgs(DataService.expansionsUrl).and.returnValue(get$);

            const actual$ = dataService.fetchExpansions();

            expect(actual$).toBeObservable(get$);
        });
    });

    describe('fetchCardTypes', () => {
        it('should make correct HTTP request and return its response data', () => {
            const get$ = cold('--(a|)');
            httpClientSpy.get.withArgs(DataService.cardTypesUrl).and.returnValue(get$);

            const actual$ = dataService.fetchCardTypes();

            expect(actual$).toBeObservable(get$);
        });
    });

    describe('fetchCards', () => {
        it('should make correct HTTP request and return its response data', () => {
            const get$ = cold('--(a|)');
            httpClientSpy.get.withArgs(DataService.cardsUrl).and.returnValue(get$);

            const actual$ = dataService.fetchCards();

            expect(actual$).toBeObservable(get$);
        });
    });
});
