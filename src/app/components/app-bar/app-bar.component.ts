import { LanguageMenuComponent } from './../language-menu/language-menu.component';
import { AppBarService } from './../../services/app-bar.service';
import { Component, ViewChild } from '@angular/core';

@Component({
    selector: 'app-bar',
    templateUrl: './app-bar.component.html',
    styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent {
    @ViewChild(LanguageMenuComponent, { static: true })
    languageMenu?: LanguageMenuComponent;

    constructor(public appBarService: AppBarService) {}
}
