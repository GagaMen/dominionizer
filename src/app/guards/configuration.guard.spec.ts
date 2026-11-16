import { signal } from '@angular/core';
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

    it('with current configuration has any expansions activated should return true', () => {
        const configuration = dataFixture.createConfiguration({
            editions: dataFixture.createEditions(),
        });
        configurationServiceSpy.configuration = signal(configuration);

        const actual = executeGuard(
            jasmine.anything() as unknown as ActivatedRouteSnapshot,
            jasmine.anything() as unknown as RouterStateSnapshot,
        );

        expect(actual).toBe(true);
    });

    it('with current configuration has no expansions activated should return url tree of configuration page', () => {
        const configuration = dataFixture.createConfiguration({
            editions: [],
        });
        configurationServiceSpy.configuration = signal(configuration);

        const actual = executeGuard(
            jasmine.anything() as unknown as ActivatedRouteSnapshot,
            jasmine.anything() as unknown as RouterStateSnapshot,
        );

        expect(actual).toBe(urlTree);
        expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/configuration']);
    });
});
