import { MatMenuTrigger } from '@angular/material/menu';
import { LanguageMenuComponent } from './../../app/components/language-menu/language-menu.component';
import { Component, ViewChild } from '@angular/core';

@Component({
    imports: [LanguageMenuComponent, MatMenuTrigger],
    template: `
        <button [matMenuTriggerFor]="menu.matMenu!" [attr.aria-hidden]="true"></button>
        <app-language-menu #menu></app-language-menu>
    `,
})
export class LanguageMenuHostComponent {
    @ViewChild(LanguageMenuComponent, { static: true })
    menu?: LanguageMenuComponent;
}
