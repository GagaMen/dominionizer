import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { map, first } from 'rxjs/operators';
import { Configuration } from '../models/configuration';
import { Observable } from 'rxjs';

export const configurationGuard: CanActivateFn = (_route, _state): Observable<boolean> => {
    const configurationService = inject(ConfigurationService);
    const router = inject(Router);

    return configurationService.configuration$.pipe(
        first(),
        map((configuration: Configuration) => {
            if (configuration.expansions.length !== 0) {
                return true;
            }

            router.navigate(['/configuration']);
            return false;
        }),
    );
};
