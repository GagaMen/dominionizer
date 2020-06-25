import { Component, Input, OnInit } from '@angular/core';
import { Card } from '../../models/card';
import { CardType } from 'src/app/models/card-type';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
    @Input() card: Card | null = null;
    types: string[] = [];

    ngOnInit(): void {
        if (this.card?.types !== undefined) {
            this.types = this.card?.types?.map<string>((type: CardType) => CardType[type]);
        }
    }
}
