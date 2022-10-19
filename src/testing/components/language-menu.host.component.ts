import { LanguageMenuComponent } from './../../app/components/language-menu/language-menu.component';
import { Component, ViewChild } from '@angular/core';

@Component({
    template: `
        <button [matMenuTriggerFor]="menu.matMenu"></button>
        <app-language-menu #menu></app-language-menu>
    `,
})
export class LanguageMenuHostComponent {
    @ViewChild(LanguageMenuComponent, { static: true })
    menu?: LanguageMenuComponent;
}
