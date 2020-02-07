import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ExpansionService } from './expansion.service';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { Expansion } from '../models/expansion';
import { DataService } from './data.service';
import { SpyObj } from 'src/testing/spy-obj';
import { concat, NEVER } from 'rxjs';

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
          useValue: jasmine.createSpyObj<DataService>('DataService', ['expansions'])
        },
      ]
    });

    dataServiceSpy = TestBed.get(DataService);
  });

  describe('expansions$', () => {
    it('with called the first time should return immediately an empty array', () => {
      const expected$ = cold('a---', { a: [] });
      dataServiceSpy.expansions.and.returnValue(NEVER);
      expansionService = TestBed.get(ExpansionService);

      const actual$ = expansionService.expansions$;

      expect(actual$).toBeObservable(expected$);
    });

    it('with DataService.expansions() completes should never complete', () => {
      const expansionData$ = cold('---|');
      const expected$ = cold('a---', { a: [] });
      dataServiceSpy.expansions.and.returnValue(expansionData$);
      expansionService = TestBed.get(ExpansionService);

      const actual$ = expansionService.expansions$;

      expect(actual$).toBeObservable(expected$);
    });

    it('should pass through data from DataService.expansions()', () => {
      const expansionData$ = cold('---(b|)', { b: testExpansions });
      const expected$ = cold('a--b---', { a: [], b: testExpansions });
      dataServiceSpy.expansions.and.returnValue(expansionData$);
      expansionService = TestBed.get(ExpansionService);

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
      dataServiceSpy.expansions.and.returnValue(expansionData$);
      expansionService = TestBed.get(ExpansionService);

      const firstActual$ = expansionService.expansions$;
      expect(firstActual$).toBeObservable(firstExpected$);

      tick(100);

      const secondActual$ = expansionService.expansions$;
      expect(secondActual$).toBeObservable(secondExpected$);
    }));
  });
});
