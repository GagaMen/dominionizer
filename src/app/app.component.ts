import { InstallService } from './services/install.service';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Component, LOCALE_ID, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { AppBarComponent } from './components/app-bar/app-bar.component';

@Component({
    selector: 'app-root',
    imports: [AppBarComponent, FooterComponent, RouterOutlet],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    private locale = inject(LOCALE_ID);
    private installService = inject(InstallService);
    router = inject(Router);

    ngOnInit(): void {
        if (environment.production) {
            environment.entryPoint = `/${this.locale}`;
        }

        this.installService.activate().subscribe();
    }
}
