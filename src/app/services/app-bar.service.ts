import { Observable, BehaviorSubject } from 'rxjs';
import { AppBarConfiguration } from './../models/app-bar-configuration';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AppBarService {
    static readonly defaultConfiguration: AppBarConfiguration = {
        navigationAction: 'none',
        actions: [],
    };

    private configurationSubject = new BehaviorSubject<AppBarConfiguration>(
        AppBarService.defaultConfiguration,
    );

    get configuration$(): Observable<AppBarConfiguration> {
        return this.configurationSubject.asObservable();
    }

    updateConfiguration(configuration: AppBarConfiguration): void {
        this.configurationSubject.next(configuration);
    }
}
