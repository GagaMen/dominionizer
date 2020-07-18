import { TestBed } from '@angular/core/testing';

import { ExpansionService } from './expansion.service';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { DataService } from './data.service';
import { SpyObj } from 'src/testing/spy-obj';
import { DataFixture } from 'src/testing/data-fixture';
import { Expansion } from '../models/expansion';

describe('ExpansionService', () => {
    let expansionService: ExpansionService;
    let dataServiceSpy: SpyObj<DataService>;
    let dataFixture: DataFixture;
    let expansions: Expansion[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: jasmine.createSpyObj<DataService>('DataService', ['fetchExpansions']),
                },
            ],
        });

        dataFixture = new DataFixture();
        expansions = dataFixture.createExpansions();

        dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    });

    describe('expansions$', () => {
        it('with initialization is pending should return from server fetched data after initialization and complete', () => {
            const fetchExpansions$ = cold('--(a|)', { a: expansions });
            const expected$ = cold('       --(a|)', { a: expansions });
            dataServiceSpy.fetchExpansions.and.returnValue(fetchExpansions$);
            expansionService = TestBed.inject(ExpansionService);

            const actual$ = expansionService.expansions$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with initialization is completed should return cached data immediately and complete', () => {
            const fetchExpansions$ = cold('--(a|)', { a: expansions });
            const expected$ = cold('       (a|)  ', { a: expansions });
            dataServiceSpy.fetchExpansions.and.returnValue(fetchExpansions$);
            expansionService = TestBed.inject(ExpansionService);
            getTestScheduler().flush();
            getTestScheduler().frame = 0;

            const actual$ = expansionService.expansions$;

            expect(actual$).toBeObservable(expected$);
        });
    });
});
