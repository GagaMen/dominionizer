import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-bar',
    templateUrl: './app-bar.component.html',
    styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent {
    @Output() sidenavToggle = new EventEmitter();
    title = 'Dominionizer';
}
