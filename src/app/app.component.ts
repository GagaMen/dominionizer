import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    @ViewChild(MatSidenav) private sidenav: MatSidenav | null = null;

    title = 'dominionizer';

    onSidenavToggle(): void {
        this.sidenav?.toggle();
    }
}
