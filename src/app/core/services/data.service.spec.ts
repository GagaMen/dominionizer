import { Observable } from 'rxjs';
import { Expansion } from './../models/expansion';
import { HttpClient } from '@angular/common/http';
import { SpyObj } from 'src/testing/spy-obj';
import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { cold } from 'jasmine-marbles';
import { CardDto } from '../dtos/card-dto';

describe('DataService', () => {
    let dataService: DataService;
    let httpClientSpy: SpyObj<HttpClient>;
    const expansions: Expansion[] = [
        { id: 1, name: 'First Expansion' },
        { id: 2, name: 'Second Expansion' },
    ];
    const cards: CardDto[] = [
        { id: 1, name: 'First Card', expansions: [1, 2], types: [1], isKingdomCard: true },
        { id: 2, name: 'Second Card', expansions: [2], types: [11], isKingdomCard: true },
        { id: 3, name: 'Third Card', expansions: [1], types: [22], isKingdomCard: false },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HttpClient,
                    useValue: jasmine.createSpyObj<HttpClient>('HttpClient', ['get']),
                },
            ],
        });

        httpClientSpy = TestBed.inject(HttpClient);
        dataService = TestBed.inject(DataService);
    });

    describe('fetchExpansions', () => {
        it('should call HttpClient.get() with the correct URL', () => {
            httpClientSpy.get.and.stub();

            dataService.fetchExpansions();

            expect(httpClientSpy.get).toHaveBeenCalledWith(DataService.expansionsUrl);
        });

        it('should return same data as HttpClient.get()', () => {
            const expansions$: Observable<Expansion[]> = cold('(a|)', { a: expansions });
            httpClientSpy.get.withArgs(DataService.expansionsUrl).and.returnValue(expansions$);

            const actual$ = dataService.fetchExpansions();

            expect(actual$).toBeObservable(expansions$);
        });
    });

    describe('fetchCards', () => {
        it('should call HttpClient.get() with the correct URL', () => {
            httpClientSpy.get.and.stub();

            dataService.fetchCards();

            expect(httpClientSpy.get).toHaveBeenCalledWith(DataService.cardsUrl);
        });

        it('should return same data as HttpClient.get()', () => {
            const cards$: Observable<CardDto[]> = cold('(a|)', { a: cards });
            httpClientSpy.get.withArgs(DataService.cardsUrl).and.returnValue(cards$);

            const actual$ = dataService.fetchCards();

            expect(actual$).toBeObservable(cards$);
        });
    });
});
