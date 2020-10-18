import { AppBarService } from './../../services/app-bar.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-bar',
    templateUrl: './app-bar.component.html',
    styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent {
    constructor(public appBarService: AppBarService) {}
}
