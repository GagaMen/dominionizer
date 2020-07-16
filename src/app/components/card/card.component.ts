import { Card } from './../../models/card';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CardType } from 'src/app/models/card-type';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
    @Input() card: Card | null = null;
    @Output() reshuffle: EventEmitter<never> = new EventEmitter<never>();
    types: string[] = [];

    ngOnInit(): void {
        if (this.card !== null) {
            this.types = this.getTypeNamesFromCard(this.card);
        }
    }

    private getTypeNamesFromCard(card: Card): string[] {
        return card.types.map<string>((type: CardType) => CardType[type]);
    }
}
