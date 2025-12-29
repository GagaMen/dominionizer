import { AppBarConfiguration } from './../models/app-bar-configuration';
import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AppBarService {
    static readonly defaultConfiguration: AppBarConfiguration = {
        navigationAction: 'none',
        actions: [],
    };

    configuration = signal<AppBarConfiguration>(AppBarService.defaultConfiguration);

    updateConfiguration(configuration: AppBarConfiguration): void {
        this.configuration.set(configuration);
    }
}
