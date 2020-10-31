import { environment } from './../../../environments/environment';
import { Card, NullCard } from './../../models/card';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardType } from 'src/app/models/card-type';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent {
    @Input() card: Card = NullCard;
    @Output() reshuffle: EventEmitter<undefined> = new EventEmitter<undefined>();

    get expansionIconUrl(): string | null {
        const icon = this.card.expansions[0]?.icon;
        return icon ? `${environment.entryPoint}${icon}` : null;
    }

    get typesLabel(): string {
        return this.card.types.map<string>((type: CardType) => CardType[type]).join(' - ');
    }
}
