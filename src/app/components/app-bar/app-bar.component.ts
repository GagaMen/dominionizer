import { Component } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
    selector: 'app-bar',
    templateUrl: './app-bar.component.html',
    styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent {
    title = 'Dominionizer';

    constructor(public themeService: ThemeService) {}

    onToggleLightTheme(checked: boolean): void {
        this.themeService.setDarkTheme(checked);
    }
}
