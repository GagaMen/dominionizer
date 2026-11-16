import { TestBed } from '@angular/core/testing';

import { EditionService } from './edition.service';
import { DataService } from './data.service';
import { injectSpy, SpyObj } from 'src/testing/spy-obj';
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
                    useValue: {
                        getEditions: vi.fn(),
                        getEditionTranslations: vi.fn(),
                    },
                },
            ],
        });

        dataFixture = new DataFixture();
        editions = dataFixture.createEditions();

        dataServiceSpy = injectSpy(DataService);
        dataServiceSpy.getEditions.mockReturnValue(editions);
        dataServiceSpy.getEditionTranslations.mockReturnValue([]);
    });

    describe('editions', () => {
        it('without translations should return source locale data', () => {
            const expected = editions;
            editionService = TestBed.inject(EditionService);

            const actual = editionService.editions;

            expect(actual).toEqual(expected);
        });

        it('with translations should return correct translated data', () => {
            const editionTranslations = dataFixture.createEditionTranslations(2);
            dataServiceSpy.getEditionTranslations.mockReturnValue(editionTranslations);
            const expected = [
                { ...editions[0], expansion: editionTranslations[0].expansion },
                { ...editions[1], expansion: editionTranslations[1].expansion },
                editions[2],
            ];
            editionService = TestBed.inject(EditionService);

            const actual = editionService.editions;

            expect(actual).toEqual(expected);
        });

        it('with both editions of an expansion should translate each of them separately', () => {
            const bothEditions = [
                dataFixture.createEdition({ id: '181-2', expansion: 'Hinterlands', edition: '2' }),
                dataFixture.createEdition({ id: '181-1', expansion: 'Hinterlands', edition: '1' }),
            ];
            dataServiceSpy.getEditions.mockReturnValue(bothEditions);
            dataServiceSpy.getEditionTranslations.mockReturnValue([
                dataFixture.createEditionTranslation({ id: '181-2', expansion: 'Hinterland' }),
                dataFixture.createEditionTranslation({ id: '181-1', expansion: 'Hinterland' }),
            ]);
            const expected = [
                { ...bothEditions[0], expansion: 'Hinterland' },
                { ...bothEditions[1], expansion: 'Hinterland' },
            ];
            editionService = TestBed.inject(EditionService);

            const actual = editionService.editions;

            expect(actual).toEqual(expected);
        });
    });
});
