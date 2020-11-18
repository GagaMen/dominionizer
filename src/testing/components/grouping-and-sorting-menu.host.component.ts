import { Component, ViewChild } from '@angular/core';
import { GroupingAndSortingMenuComponent } from 'src/app/components/grouping-and-sorting-menu/grouping-and-sorting-menu.component';

@Component({
    template: `
        <button [matMenuTriggerFor]="menu.matMenu"></button>
        <app-grouping-and-sorting-menu #menu></app-grouping-and-sorting-menu>
    `,
})
export class GroupingAndSortingMenuHostComponent {
    @ViewChild(GroupingAndSortingMenuComponent, { static: true })
    menu?: GroupingAndSortingMenuComponent;
}
