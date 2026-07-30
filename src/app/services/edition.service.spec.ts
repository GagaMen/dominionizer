import { EditionTranslation } from './../models/edition';
import { TestBed } from '@angular/core/testing';

import { EditionService } from './edition.service';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { DataService } from './data.service';
import { SpyObj } from 'src/testing/spy-obj';
import { DataFixture } from 'src/testing/data-fixture';
import { Edition } from '../models/edition';

describe('EditionService', () => {
    let editionService: EditionService;
    let dataServiceSpy: SpyObj<DataService>;
    let dataFixture: DataFixture;
    let editions: Edition[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: jasmine.createSpyObj<DataService>('DataService', [
                        'fetchEditions',
                        'fetchEditionTranslations',
                    ]),
                },
            ],
        });

        dataFixture = new DataFixture();
        editions = dataFixture.createEditions();

        dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
        dataServiceSpy.fetchEditions.and.returnValue(cold('--(a|)', { a: editions }));
        dataServiceSpy.fetchEditionTranslations.and.returnValue(cold('(a|)', { a: [] }));
    });

    describe('editions$', () => {
        it('with initialization is pending should return from server fetched data after initialization and complete', () => {
            const expected$ = cold('       --(a|)', { a: editions });
            editionService = TestBed.inject(EditionService);

            const actual$ = editionService.editions$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with initialization is completed should return cached data immediately and complete', () => {
            const expected$ = cold('       (a|)  ', { a: editions });
            editionService = TestBed.inject(EditionService);
            getTestScheduler().flush();
            getTestScheduler().frame = 0;

            const actual$ = editionService.editions$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with translations should return correct translated data and complete', () => {
            const editionTranslations = dataFixture.createEditionTranslations(2);
            const editionTranslations$ = cold('---(a|)', { a: editionTranslations });
            dataServiceSpy.fetchEditionTranslations.and.returnValue(editionTranslations$);
            const expected = editions.map((edition: Edition) => {
                const translation = editionTranslations.find(
                    (editionTranslation: EditionTranslation) =>
                        editionTranslation.id === edition.id,
                );

                if (translation === undefined) {
                    return edition;
                }

                return {
                    ...edition,
                    ...translation,
                };
            });
            const expected$ = cold('---(a|)', { a: expected });
            editionService = TestBed.inject(EditionService);

            const actual$ = editionService.editions$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with both editions of an expansion should translate each of them separately', () => {
            const bothEditions = [
                dataFixture.createEdition({ id: '310', expansion: 'Hinterlands', edition: '2' }),
                dataFixture.createEdition({ id: '311', expansion: 'Hinterlands', edition: '1' }),
            ];
            dataServiceSpy.fetchEditions.and.returnValue(cold('---(a|)', { a: bothEditions }));
            const editionTranslations = [
                dataFixture.createEditionTranslation({ id: '310', expansion: 'Hinterland' }),
                dataFixture.createEditionTranslation({ id: '311', expansion: 'Hinterland' }),
            ];
            dataServiceSpy.fetchEditionTranslations.and.returnValue(
                cold('---(b|)', { b: editionTranslations }),
            );
            const expected = [
                { ...bothEditions[0], expansion: 'Hinterland' },
                { ...bothEditions[1], expansion: 'Hinterland' },
            ];
            const expected$ = cold('---(a|)', { a: expected });
            editionService = TestBed.inject(EditionService);

            const actual$ = editionService.editions$;

            expect(actual$).toBeObservable(expected$);
        });
    });
});
