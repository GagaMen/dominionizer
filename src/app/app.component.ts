import { InstallService } from './services/install.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private installService: InstallService,
        public router: Router,
    ) {}

    ngOnInit(): void {
        if (environment.production) {
            environment.entryPoint = `/${this.locale}`;
        }

        this.installService.activate().subscribe();
    }
}
