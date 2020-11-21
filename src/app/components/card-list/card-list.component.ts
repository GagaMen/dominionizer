import { ShuffleService } from 'src/app/services/shuffle.service';
import { SetPartName } from './../../models/set';
import { Component, Input } from '@angular/core';
import { Card } from '../../models/card';

@Component({
    selector: 'app-card-list',
    templateUrl: './card-list.component.html',
    styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent {
    @Input() setPartName: SetPartName = 'kingdomCards';
    @Input() cardList: Card[] = [];

    constructor(private shuffleService: ShuffleService) {}

    onReshuffle(card: Card): void {
        this.shuffleService.shuffleSingleCard(card, this.setPartName);
    }
}
