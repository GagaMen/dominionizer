import { environment } from 'src/environments/environment';
import { Component, Inject, LOCALE_ID } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(@Inject(LOCALE_ID) private locale: string) {
        if (environment.production) {
            environment.entryPoint = `/${this.locale}`;
        }
    }
}
