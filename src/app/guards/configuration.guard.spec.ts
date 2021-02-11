import { TestBed } from '@angular/core/testing';

import { ConfigurationGuard } from './configuration.guard';
import { SpyObj } from 'src/testing/spy-obj';
import { Router } from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { DataFixture } from 'src/testing/data-fixture';
import { cold, getTestScheduler } from 'jasmine-marbles';

describe('ConfigurationGuard', () => {
    let configurationGuard: ConfigurationGuard;
    let routerSpy: SpyObj<Router>;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ConfigurationGuard,
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
                { provide: ConfigurationService, useValue: {} },
            ],
        });

        dataFixture = new DataFixture();
        routerSpy = (TestBed.inject(Router) as unknown) as SpyObj<Router>;
        configurationServiceSpy = (TestBed.inject(
            ConfigurationService,
        ) as unknown) as SpyObj<ConfigurationService>;
        configurationGuard = TestBed.inject(ConfigurationGuard);
    });

    describe('canActivate', () => {
        it('with current configuration has any expansions activated should return true and complete', () => {
            const configuration = dataFixture.createConfiguration({
                expansions: dataFixture.createExpansions(),
            });
            configurationServiceSpy.configuration$ = cold('-a-----', { a: configuration });
            const expected$ = cold('                       -(b|)  ', { b: true });

            const actual$ = configurationGuard.canActivate();

            expect(actual$).toBeObservable(expected$);
        });

        it('with current configuration has no expansions activated should return false and complete', () => {
            const configuration = dataFixture.createConfiguration({
                expansions: [],
            });
            configurationServiceSpy.configuration$ = cold('-a-----', { a: configuration });
            const expected$ = cold('                       -(b|)  ', { b: false });

            const actual$ = configurationGuard.canActivate();

            expect(actual$).toBeObservable(expected$);
        });

        it('with current configuration has no expansions activated should navigate to start page', () => {
            const configuration = dataFixture.createConfiguration({
                expansions: [],
            });
            configurationServiceSpy.configuration$ = cold('-a-----', { a: configuration });

            configurationGuard.canActivate().subscribe({ error: fail });
            getTestScheduler().flush();

            expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
        });
    });
});
