import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceWorkerData } from '../models/service-worker-data';

@Injectable({
    providedIn: 'root',
})
export class InstallService {
    constructor(private http: HttpClient) {}

    activate(): Observable<unknown> {
        return fromEvent(window, 'appinstalled').pipe(switchMap(() => this.loadImages()));
    }

    loadImages(): Observable<unknown> {
        return this.http.get<ServiceWorkerData>(`${environment.entryPoint}/ngsw.json`).pipe(
            switchMap((serviceWorkerData) => {
                const imagesAssetGroup = serviceWorkerData.assetGroups.find(
                    (assetGroup) => assetGroup.name === 'images',
                );

                const imageRequests = imagesAssetGroup?.urls.map((imageUrl) =>
                    this.http.get(imageUrl, { responseType: 'blob' }),
                );

                return merge(...(imageRequests ?? []));
            }),
        );
    }
}
