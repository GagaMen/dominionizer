import { AppBarService } from '../../services/app-bar.service';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ShuffleService } from '../../services/shuffle.service';
import { SetService } from 'src/app/services/set.service';
import { SetOrderingMenuComponent } from '../set-ordering-menu/set-ordering-menu.component';
import { CardListComponent } from '../card-list/card-list.component';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-set',
    imports: [
        CardListComponent,
        SetOrderingMenuComponent,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        AsyncPipe,
    ],
    templateUrl: './set.component.html',
    styleUrls: ['./set.component.scss'],
})
export class SetComponent implements OnInit {
    setService = inject(SetService);
    private shuffleService = inject(ShuffleService);
    private appBarService = inject(AppBarService);

    @ViewChild(SetOrderingMenuComponent, { static: true })
    setOrderingMenu?: SetOrderingMenuComponent;

    ngOnInit(): void {
        this.shuffle();
        this.appBarService.updateConfiguration({
            navigationAction: 'back',
            actions: [
                {
                    icon: 'sort',
                    // setOrderingMenu is garantied to be defined because ViewChild query result
                    // is resolved before change detection runs (see: static = true)

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
