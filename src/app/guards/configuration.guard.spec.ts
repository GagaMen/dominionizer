import { TestBed } from '@angular/core/testing';

import { configurationGuard } from './configuration.guard';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { SpyObj } from 'src/testing/spy-obj';
import { DataFixture } from 'src/testing/data-fixture';
import { cold } from 'jasmine-marbles';

describe('configurationGuard', () => {
    let routerSpy: SpyObj<Router>;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let dataFixture: DataFixture;
    let urlTree: UrlTree;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => configurationGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj<Router>('Router', ['createUrlTree']),
                },
                { provide: ConfigurationService, useValue: {} },
            ],
        });

        dataFixture = new DataFixture();
        urlTree = new UrlTree();
        routerSpy = TestBed.inject(Router) as unknown as SpyObj<Router>;
        routerSpy.createUrlTree.and.returnValue(urlTree);
        configurationServiceSpy = TestBed.inject(
            ConfigurationService,
        ) as unknown as SpyObj<ConfigurationService>;
    });

    it('with current configuration has any expansions activated should return true and complete', () => {
        const configuration = dataFixture.createConfiguration({
            editions: dataFixture.createEditions(),
        });
        configurationServiceSpy.configuration$ = cold('-a-----', { a: configuration });
        const expected$ = cold('                       -(b|)  ', { b: true });

        const actual$ = executeGuard(
            jasmine.anything() as unknown as ActivatedRouteSnapshot,
            jasmine.anything() as unknown as RouterStateSnapshot,
        );

        expect(actual$).toBeObservable(expected$);
    });

    it('with current configuration has no expansions activated should return url tree of configuration page and complete', () => {
        const configuration = dataFixture.createConfiguration({
            editions: [],
        });
        configurationServiceSpy.configuration$ = cold('-a-----', { a: configuration });
        const expected$ = cold('                       -(b|)  ', { b: urlTree });

        const actual$ = executeGuard(
            jasmine.anything() as unknown as ActivatedRouteSnapshot,
            jasmine.anything() as unknown as RouterStateSnapshot,
        );

        expect(actual$).toBeObservable(expected$);
        expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/configuration']);
    });
});
