import { Component, ViewChild } from '@angular/core';
import { SetOrderingMenuComponent } from 'src/app/components/set-ordering-menu/set-ordering-menu.component';

@Component({
    template: `
        <button [matMenuTriggerFor]="menu.matMenu"></button>
        <app-set-ordering-menu #menu></app-set-ordering-menu>
    `,
})
export class SetOrderingMenuHostComponent {
    @ViewChild(SetOrderingMenuComponent, { static: true })
    menu?: SetOrderingMenuComponent;
}
