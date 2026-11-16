import { ShuffleService } from 'src/app/services/shuffle.service';
import { Component, inject, ChangeDetectionStrategy, input } from '@angular/core';
import { Card } from '../../models/card';
import { CardComponent } from '../card/card.component';

@Component({
    selector: 'app-card-list',
    imports: [CardComponent],
    templateUrl: './card-list.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent {
    private shuffleService = inject(ShuffleService);

    readonly cardList = input<Card[]>([]);

    onReshuffle(card: Card): void {
        this.shuffleService.shuffleSingleCard(card);
    }
}
