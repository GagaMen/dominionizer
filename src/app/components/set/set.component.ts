import { AppBarService } from '../../services/app-bar.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ShuffleService } from '../../services/shuffle.service';
import { SetService } from 'src/app/services/set.service';
import { GroupingAndSortingMenuComponent } from '../grouping-and-sorting-menu/grouping-and-sorting-menu.component';

@Component({
    selector: 'app-set',
    templateUrl: './set.component.html',
    styleUrls: ['./set.component.scss'],
})
export class SetComponent implements OnInit {
    @ViewChild(GroupingAndSortingMenuComponent, { static: true })
    groupingAndSortingMenu?: GroupingAndSortingMenuComponent;

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
                    // groupingAndSortingMenu is garantied to be defined because ViewChild query result
                    // is resolved before change detection runs (see static = true)
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    matMenu: this.groupingAndSortingMenu!.matMenu,
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
}
