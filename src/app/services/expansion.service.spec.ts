import { ExpansionTranslation } from './../models/expansion';
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
                    useValue: jasmine.createSpyObj<DataService>('DataService', [
                        'fetchExpansions',
                        'fetchExpansionTranslations',
                    ]),
                },
            ],
        });

        dataFixture = new DataFixture();
        expansions = dataFixture.createExpansions();

        dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
        dataServiceSpy.fetchExpansions.and.returnValue(cold('--(a|)', { a: expansions }));
        dataServiceSpy.fetchExpansionTranslations.and.returnValue(cold('(a|)', { a: [] }));
    });

    describe('expansions$', () => {
        it('with initialization is pending should return from server fetched data after initialization and complete', () => {
            const expected$ = cold('       --(a|)', { a: expansions });
            expansionService = TestBed.inject(ExpansionService);

            const actual$ = expansionService.expansions$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with initialization is completed should return cached data immediately and complete', () => {
            const expected$ = cold('       (a|)  ', { a: expansions });
            expansionService = TestBed.inject(ExpansionService);
            getTestScheduler().flush();
            getTestScheduler().frame = 0;

            const actual$ = expansionService.expansions$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with translations should return correct translated data and complete', () => {
            const expansionTranslations = dataFixture.createExpansionTranslations(2);
            const expansionTranslations$ = cold('---(a|)', { a: expansionTranslations });
            dataServiceSpy.fetchExpansionTranslations.and.returnValue(expansionTranslations$);
            const expected = expansions.map((expansion: Expansion) => {
                const translation = expansionTranslations.find(
                    (expansionTranslation: ExpansionTranslation) =>
                        expansionTranslation.id === expansion.id,
                );

                if (translation === undefined) {
                    return expansion;
                }

                return {
                    ...expansion,
                    ...translation,
                };
            });
            const expected$ = cold('---(a|)', { a: expected });
            expansionService = TestBed.inject(ExpansionService);

            const actual$ = expansionService.expansions$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with expansions contains 2. editions and translations should correct return translated data and complete', () => {
            const secondEditionExpansions = [
                dataFixture.createExpansion({ id: 181, name: 'Hinterlands' }),
                dataFixture.createExpansion({ id: 181.1, name: 'Hinterlands (2. Edition)' }),
            ];
            dataServiceSpy.fetchExpansions.and.returnValue(
                cold('---(a|)', { a: secondEditionExpansions }),
            );
            const expansionTranslations = [
                dataFixture.createExpansionTranslation({ id: 181, name: 'Hinterland' }),
            ];
            const expansionTranslations$ = cold('---(b|)', { b: expansionTranslations });
            dataServiceSpy.fetchExpansionTranslations.and.returnValue(expansionTranslations$);
            const expected = [
                { ...secondEditionExpansions[0], name: 'Hinterland' },
                { ...secondEditionExpansions[1], name: 'Hinterland (2. Edition)' },
            ];
            const expected$ = cold('---(a|)', { a: expected });
            expansionService = TestBed.inject(ExpansionService);

            const actual$ = expansionService.expansions$;

            expect(actual$).toBeObservable(expected$);
        });
    });
});
