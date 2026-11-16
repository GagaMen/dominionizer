import { when } from 'vitest-when';
import type { Mock } from 'vitest';
import { environment } from 'src/environments/environment';
import { injectSpy, SpyObj } from 'src/testing/spy-obj';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { InstallService } from './install.service';
import { ServiceWorkerData } from '../models/service-worker-data';
import { EMPTY, of } from 'rxjs';

describe('InstallService', () => {
    let installService: InstallService;
    let httpClientSpy: SpyObj<HttpClient>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HttpClient,
                    useValue: {
                        get: vi.fn(),
                    },
                },
            ],
        });

        httpClientSpy = injectSpy(HttpClient);
        installService = TestBed.inject(InstallService);
    });

    describe('activate', () => {
        it('with "appinstalled" event is triggered should load images', () => {
            const loadImagesSpy = vi.spyOn(installService, 'loadImages').mockReturnValue(EMPTY);

            const subscription = installService.activate().subscribe();
            window.dispatchEvent(new Event('appinstalled'));
            subscription.unsubscribe();

            expect(loadImagesSpy).toHaveBeenCalled();
        });

        it('with "appinstalled" event is not triggered should not load images', () => {
            const loadImagesSpy = vi.spyOn(installService, 'loadImages').mockReturnValue(EMPTY);

            const subscription = installService.activate().subscribe();
            subscription.unsubscribe();

            expect(loadImagesSpy).not.toHaveBeenCalled();
        });
    });

    describe('loadImages', () => {
        it('should load images correctly', () => {
            environment.entryPoint = '/de';
            const serviceWorkerData: ServiceWorkerData = {
                assetGroups: [
                    {
                        name: 'app',
                        urls: ['/de/favicon.ico'],
                    },
                    {
                        name: 'images',
                        urls: [
                            '/de/assets/card_art/Abandoned_MineArt.jpg',
                            '/de/assets/card_art/AcademyArt.jpg',
                            '/de/assets/card_art/Acting_TroupeArt.jpg',
                        ],
                    },
                ],
            };
            httpClientSpy.get.mockReturnValue(EMPTY);
            when(httpClientSpy.get)
                .calledWith(`${environment.entryPoint}/ngsw.json`)
                .thenReturn(of(serviceWorkerData));

            installService.loadImages().subscribe();

            expect(httpClientSpy.get as Mock).toHaveBeenCalledWith(
                '/de/assets/card_art/Abandoned_MineArt.jpg',
                { responseType: 'blob' },
            );
            expect(httpClientSpy.get as Mock).toHaveBeenCalledWith(
                '/de/assets/card_art/AcademyArt.jpg',
                { responseType: 'blob' },
            );
            expect(httpClientSpy.get as Mock).toHaveBeenCalledWith(
                '/de/assets/card_art/Acting_TroupeArt.jpg',
                { responseType: 'blob' },
            );
            expect(httpClientSpy.get as Mock).not.toHaveBeenCalledWith('/favicon.ico', {
                responseType: 'blob',
            });
        });
    });
});
