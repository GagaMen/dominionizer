import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { SetOrderingMenuComponent } from 'src/app/components/set-ordering-menu/set-ordering-menu.component';

@Component({
    imports: [SetOrderingMenuComponent, MatMenuTrigger],
    template: `
        <button [matMenuTriggerFor]="menu.matMenu!" [attr.aria-hidden]="true"></button>
        <app-set-ordering-menu #menu></app-set-ordering-menu>
    `,
})
export class SetOrderingMenuHostComponent {
    @ViewChild(SetOrderingMenuComponent, { static: true })
    menu?: SetOrderingMenuComponent;
}
