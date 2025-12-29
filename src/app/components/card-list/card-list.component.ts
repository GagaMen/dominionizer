import { ShuffleService } from 'src/app/services/shuffle.service';
import { Component, Input, inject } from '@angular/core';
import { Card } from '../../models/card';
import { CardComponent } from '../card/card.component';

@Component({
    selector: 'app-card-list',
    imports: [CardComponent],
    templateUrl: './card-list.component.html',
    styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent {
    private shuffleService = inject(ShuffleService);

    @Input() cardList: Card[] = [];

    onReshuffle(card: Card): void {
        this.shuffleService.shuffleSingleCard(card);
    }
}
