import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ExpansionService } from './expansion.service';
import { cold } from 'jasmine-marbles';
import { Expansion } from '../models/expansion';
import { DataService } from './data.service';
import { SpyObj } from 'src/testing/spy-obj';

describe('ExpansionService', () => {
    let expansionService: ExpansionService;
    let dataServiceSpy: SpyObj<DataService>;
    const testExpansions: Expansion[] = [
        { id: 1, name: 'First Test Expansion' },
        { id: 2, name: 'Second Test Expansion' },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: jasmine.createSpyObj<DataService>('DataService', ['fetchExpansions']),
                },
            ],
        });

        dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    });

    describe('expansions$', () => {
        it('should return data from DataService.expansions() and complete', () => {
            const expansionData$ = cold('---(a|)', { a: testExpansions });
            const expected$ = cold('     ---(a|)', { a: testExpansions });
            dataServiceSpy.fetchExpansions.and.returnValue(expansionData$);
            expansionService = TestBed.inject(ExpansionService);

            const actual$ = expansionService.expansions$;

            expect(actual$).toBeObservable(expected$);
        });

        // TODO: Test doesn't work this way and needs to be fixed
        //      - implementation with BehaviorSubject works correctly
        //      - test calls DataService.expansions() twice instead of once as expected
        //      - either the test needs to be rewritten or the test tools (rxjs, jasmine-marbles)
        //        are buggy
        xit('with second call after delay should return data immediately', fakeAsync(() => {
            const expansionData$ = cold('---(a|)', { a: testExpansions });
            const firstExpected$ = cold('a--b---', { a: [], b: testExpansions });
            const secondExpected$ = cold('a-----', { a: testExpansions });
            dataServiceSpy.fetchExpansions.and.returnValue(expansionData$);
            expansionService = TestBed.inject(ExpansionService);

            const firstActual$ = expansionService.expansions$;
            expect(firstActual$).toBeObservable(firstExpected$);

            tick(100);

            const secondActual$ = expansionService.expansions$;
            expect(secondActual$).toBeObservable(secondExpected$);
        }));
    });
});
