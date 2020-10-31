import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../services/configuration.service';
import { map, first } from 'rxjs/operators';
import { Configuration } from '../models/configuration';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationGuard implements CanActivate {
    constructor(private router: Router, private configurationService: ConfigurationService) {}

    canActivate(): Observable<boolean> {
        return this.configurationService.configuration$.pipe(
            first(),
            map((configuration: Configuration) => {
                if (configuration.expansions.length !== 0) {
                    return true;
                }

                this.router.navigate(['/']);
                return false;
            }),
        );
    }
}
