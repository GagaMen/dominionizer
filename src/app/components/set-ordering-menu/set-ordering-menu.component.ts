import { Component, ViewChild, inject } from '@angular/core';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { GroupingOption, SetService, SortingOption } from 'src/app/services/set.service';
import { MatDivider } from '@angular/material/divider';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-set-ordering-menu',
    imports: [MatMenu, MatMenuItem, MatIcon, MatDivider, AsyncPipe],
    templateUrl: './set-ordering-menu.component.html',
    styleUrls: ['./set-ordering-menu.component.scss'],
})
export class SetOrderingMenuComponent {
    setService = inject(SetService);

    @ViewChild(MatMenu, { static: true }) matMenu?: MatMenu;

    onGroup(groupingOption: GroupingOption): void {
        this.setService.updateGroupingOption(groupingOption);
    }

    onSort(sortingOption: SortingOption): void {
        this.setService.updateSortingOption(sortingOption);
    }
}
