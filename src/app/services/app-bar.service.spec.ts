import { DataFixture } from './../../testing/data-fixture';
import { TestBed } from '@angular/core/testing';

import { AppBarService } from './app-bar.service';

describe('AppBarService', () => {
    let appBarService: AppBarService;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        dataFixture = new DataFixture();
        appBarService = TestBed.inject(AppBarService);
    });

    describe('configuration', () => {
        it('with service just initialized should return default configuration', () => {
            const expected = AppBarService.defaultConfiguration;

            const actual = appBarService.configuration();

            expect(actual).toEqual(expected);
        });
    });

    describe('updateConfiguration', () => {
        it('should update configuration', () => {
            const configuration = dataFixture.createAppBarConfiguration();

            appBarService.updateConfiguration(configuration);
            const actual = appBarService.configuration();

            expect(actual).toEqual(configuration);
        });
    });
});
