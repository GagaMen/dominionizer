import { Component, Input, OnInit } from '@angular/core';
import { Card } from '../../models/card';
import { CardType } from 'src/app/models/card-type';
import { ShuffleService } from 'src/app/services/shuffle.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
    @Input() card: Card | null = null;
    types: string[] = [];

    constructor(private shuffleService: ShuffleService) {}

    ngOnInit(): void {
        if (this.card?.types !== undefined) {
            this.types = this.card?.types?.map<string>((type: CardType) => CardType[type]);
        }
    }

    onReshuffle(): void {
        let cards: Observable<Card[]>;
        if (this.card?.types.includes(CardType.Event)) {
            cards = this.shuffleService.shuffleEvents(1);
        } else if (this.card?.types.includes(CardType.Landmark)) {
            cards = this.shuffleService.shuffleEvents(1);
        } else if (this.card?.types.includes(CardType.Project)) {
            cards = this.shuffleService.shuffleEvents(1);
        } else if (this.card?.types.includes(CardType.Way)) {
            cards = this.shuffleService.shuffleEvents(1);
        } else {
            cards = this.shuffleService.shuffleKingdomCards(1);
        }

        // TODO: reshuffle if given card already exists or if the card is identical with the previous one
        // maybe it's a good idea to filter available cards based on current set befor the shuffle process is started
        cards.subscribe((cards: Card[]) => {
            this.card = cards[0];
        });
    }
}
