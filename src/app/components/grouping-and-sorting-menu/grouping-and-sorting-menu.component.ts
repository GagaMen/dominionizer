import { Component, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { GroupingOption, SetService, SortingOption } from 'src/app/services/set.service';

@Component({
    selector: 'app-grouping-and-sorting-menu',
    templateUrl: './grouping-and-sorting-menu.component.html',
    styleUrls: ['./grouping-and-sorting-menu.component.scss'],
})
export class GroupingAndSortingMenuComponent {
    @ViewChild(MatMenu, { static: true }) matMenu?: MatMenu;

    constructor(public setService: SetService) {}

    onGroup(groupingOption: GroupingOption): void {
        this.setService.updateGroupingOption(groupingOption);
    }

    onSort(sortingOption: SortingOption): void {
        this.setService.updateSortingOption(sortingOption);
    }
}
