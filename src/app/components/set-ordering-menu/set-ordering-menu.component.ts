import { Component, ViewChild } from '@angular/core';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { GroupingOption, SetService, SortingOption } from 'src/app/services/set.service';
import { MatDivider } from '@angular/material/divider';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-set-ordering-menu',
    standalone: true,
    imports: [MatMenu, MatMenuItem, MatIcon, MatDivider, NgIf, AsyncPipe],
    templateUrl: './set-ordering-menu.component.html',
    styleUrls: ['./set-ordering-menu.component.scss'],
})
export class SetOrderingMenuComponent {
    @ViewChild(MatMenu, { static: true }) matMenu?: MatMenu;

    constructor(public setService: SetService) {}

    onGroup(groupingOption: GroupingOption): void {
        this.setService.updateGroupingOption(groupingOption);
    }

    onSort(sortingOption: SortingOption): void {
        this.setService.updateSortingOption(sortingOption);
    }
}
