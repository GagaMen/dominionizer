import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';

export const configurationGuard: CanActivateFn = (_route, _state): boolean | UrlTree => {
    const configurationService = inject(ConfigurationService);
    const router = inject(Router);

    if (configurationService.configuration().editions.length !== 0) {
        return true;
    }

    return router.createUrlTree(['/configuration']);
};
