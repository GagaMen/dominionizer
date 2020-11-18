import { AppBarService } from '../../services/app-bar.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ShuffleService } from '../../services/shuffle.service';
import { GroupingOption, SetService, SortingOption } from 'src/app/services/set.service';
import { MatMenu } from '@angular/material/menu';

@Component({
    selector: 'app-set',
    templateUrl: './set.component.html',
    styleUrls: ['./set.component.scss'],
})
export class SetComponent implements OnInit {
    @ViewChild('menu', { static: true }) menu?: MatMenu;

    constructor(
        public setService: SetService,
        private shuffleService: ShuffleService,
        private appBarService: AppBarService,
    ) {}

    ngOnInit(): void {
        this.shuffle();
        this.appBarService.updateConfiguration({
            navigationAction: 'back',
            actions: [
                {
                    icon: 'sort',
                    matMenu: this.menu,
                },
                {
                    icon: 'casino',
                    onClick: () => this.shuffle(),
                },
            ],
        });
    }

    shuffle(): void {
        this.shuffleService.shuffleCards();
    }

    onGroup(groupingOption: GroupingOption): void {
        this.setService.updateGroupingOption(groupingOption);
    }

    onSort(sortingOption: SortingOption): void {
        this.setService.updateSortingOption(sortingOption);
    }
}
