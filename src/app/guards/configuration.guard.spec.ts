import { TestBed } from '@angular/core/testing';

import { configurationGuard } from './configuration.guard';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { SpyObj } from 'src/testing/spy-obj';
import { DataFixture } from 'src/testing/data-fixture';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { Observable } from 'rxjs';

describe('configurationGuard', () => {
    let routerSpy: SpyObj<Router>;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let dataFixture: DataFixture;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => configurationGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
                { provide: ConfigurationService, useValue: {} },
            ],
        });

        dataFixture = new DataFixture();
        routerSpy = TestBed.inject(Router) as unknown as SpyObj<Router>;
        configurationServiceSpy = TestBed.inject(
            ConfigurationService,
        ) as unknown as SpyObj<ConfigurationService>;
    });

    it('with current configuration has any expansions activated should return true and complete', () => {
        const configuration = dataFixture.createConfiguration({
            expansions: dataFixture.createExpansions(),
        });
        configurationServiceSpy.configuration$ = cold('-a-----', { a: configuration });
        const expected$ = cold('                       -(b|)  ', { b: true });

        const actual$ = executeGuard(
            jasmine.anything() as unknown as ActivatedRouteSnapshot,
            jasmine.anything() as unknown as RouterStateSnapshot,
        );

        expect(actual$).toBeObservable(expected$);
    });

    it('with current configuration has no expansions activated should return false and complete', () => {
        const configuration = dataFixture.createConfiguration({
            expansions: [],
        });
        configurationServiceSpy.configuration$ = cold('-a-----', { a: configuration });
        const expected$ = cold('                       -(b|)  ', { b: false });

        const actual$ = executeGuard(
            jasmine.anything() as unknown as ActivatedRouteSnapshot,
            jasmine.anything() as unknown as RouterStateSnapshot,
        );

        expect(actual$).toBeObservable(expected$);
    });

    it('with current configuration has no expansions activated should navigate to start page', () => {
        const configuration = dataFixture.createConfiguration({
            expansions: [],
        });
        configurationServiceSpy.configuration$ = cold('-a-----', { a: configuration });

        const actual$ = executeGuard(
            jasmine.anything() as unknown as ActivatedRouteSnapshot,
            jasmine.anything() as unknown as RouterStateSnapshot,
        );

        (actual$ as Observable<boolean>).subscribe();
        getTestScheduler().flush();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/configuration']);
    });
});
