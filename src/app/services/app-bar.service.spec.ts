import { DataFixture } from './../../testing/data-fixture';
import { cold } from 'jasmine-marbles';
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

    describe('configuration$', () => {
        it('with service just initialized should emit default configuration', () => {
            const expected$ = cold('a', { a: AppBarService.defaultConfiguration });

            const actual$ = appBarService.configuration$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('updateConfiguration', () => {
        it('should update configuration', () => {
            const configuration = dataFixture.createAppBarConfiguration();
            const expected$ = cold('a', { a: configuration });

            appBarService.updateConfiguration(configuration);
            const actual$ = appBarService.configuration$;

            expect(actual$).toBeObservable(expected$);
        });
    });
});
