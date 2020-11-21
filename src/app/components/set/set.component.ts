import { AppBarService } from '../../services/app-bar.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ShuffleService } from '../../services/shuffle.service';
import { SetService } from 'src/app/services/set.service';
import { SetOrderingMenuComponent } from '../set-ordering-menu/set-ordering-menu.component';

@Component({
    selector: 'app-set',
    templateUrl: './set.component.html',
    styleUrls: ['./set.component.scss'],
})
export class SetComponent implements OnInit {
    @ViewChild(SetOrderingMenuComponent, { static: true })
    setOrderingMenu?: SetOrderingMenuComponent;

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
                    // setOrderingMenu is garantied to be defined because ViewChild query result
                    // is resolved before change detection runs (see: static = true)
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    matMenu: this.setOrderingMenu!.matMenu,
                },
                {
                    icon: 'casino',
                    onClick: () => this.shuffle(),
                },
            ],
        });
    }

    shuffle(): void {
        this.shuffleService.shuffleSet();
    }
}
