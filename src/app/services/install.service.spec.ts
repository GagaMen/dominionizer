import { environment } from 'src/environments/environment';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { SpyObj } from 'src/testing/spy-obj';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { InstallService } from './install.service';
import { ServiceWorkerData } from '../models/service-worker-data';
import { EMPTY } from 'rxjs';

describe('InstallService', () => {
    let installService: InstallService;
    let httpClientSpy: SpyObj<HttpClient>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HttpClient,
                    useValue: jasmine.createSpyObj<HttpClient>('HttpClient', ['get']),
                },
            ],
        });

        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        installService = TestBed.inject(InstallService);
    });

    describe('activate', () => {
        it('with "appinstalled" event is triggered should load images', () => {
            const loadImagesSpy = spyOn(installService, 'loadImages').and.returnValue(EMPTY);

            const subscription = installService.activate().subscribe();
            window.dispatchEvent(new Event('appinstalled'));
            subscription.unsubscribe();

            expect(loadImagesSpy).toHaveBeenCalled();
        });

        it('with "appinstalled" event is not triggered should not load images', () => {
            const loadImagesSpy = spyOn(installService, 'loadImages').and.returnValue(EMPTY);

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
            const serviceWorkerData$ = cold('--(a|)', { a: serviceWorkerData });
            httpClientSpy.get
                .withArgs(`${environment.entryPoint}/ngsw.json`)
                .and.returnValue(serviceWorkerData$);
            httpClientSpy.get.and.returnValue(EMPTY);

            installService.loadImages().subscribe();
            getTestScheduler().flush();

            expect(httpClientSpy.get as jasmine.Spy).toHaveBeenCalledWith(
                '/de/assets/card_art/Abandoned_MineArt.jpg',
                { responseType: 'blob' },
            );
            expect(httpClientSpy.get as jasmine.Spy).toHaveBeenCalledWith(
                '/de/assets/card_art/AcademyArt.jpg',
                { responseType: 'blob' },
            );
            expect(httpClientSpy.get as jasmine.Spy).toHaveBeenCalledWith(
                '/de/assets/card_art/Acting_TroupeArt.jpg',
                { responseType: 'blob' },
            );
            expect(httpClientSpy.get as jasmine.Spy).not.toHaveBeenCalledWith('/favicon.ico', {
                responseType: 'blob',
            });
        });
    });
});
