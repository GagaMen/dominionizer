import { Component, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { GroupingOption, SetService, SortingOption } from 'src/app/services/set.service';

@Component({
    selector: 'app-set-ordering-menu',
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
