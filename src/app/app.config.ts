import { ApplicationConfig } from '@angular/core';
import { environment } from '../environments/environment';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideAnimations(),
        provideServiceWorker('ngsw-worker.js', { enabled: environment.production }),
    ],
};
