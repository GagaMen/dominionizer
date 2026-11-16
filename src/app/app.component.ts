import { InstallService } from './services/install.service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
    Component,
    LOCALE_ID,
    OnInit,
    inject,
    ChangeDetectionStrategy,
    computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
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
    private router = inject(Router);

    private readonly url = toSignal(
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => this.router.url),
        ),
        { initialValue: this.router.url },
    );

    readonly isAppBarVisible = computed(() => this.url() !== '/');

    ngOnInit(): void {
        if (environment.production) {
            environment.entryPoint = `/${this.locale}`;
        }

        this.installService.activate().subscribe();
    }
}
