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
    static readonly colorOfCardTypes: Map<CardType, string> = new Map([
        [CardType.Action, '#ede4c7'],
        [CardType.Duration, '#f89a43'],
        [CardType.Event, '#bbbeb7'],
        [CardType.Landmark, '#59ac68'],
        [CardType.Night, '#5d6a73'],
        [CardType.Project, '#f5afad'],
        [CardType.Reaction, '#aeb1d2'],
        [CardType.Reserve, '#d5bd59'],
        [CardType.Ruins, '#956415'],
        [CardType.Shelter, '#e58265'],
        [CardType.Treasure, '#fff095'],
        [CardType.Victory, '#adcd2a'],
        [CardType.Way, '#d3eef9'],
    ]);

    @Input() card: Card = NullCard;
    @Output() reshuffle: EventEmitter<undefined> = new EventEmitter<undefined>();

    get expansionIconUrl(): string | null {
        const icon = this.card.expansions[0]?.icon;
        return icon ? `${environment.entryPoint}${icon}` : null;
    }

    get typesLabel(): string {
        return this.card.types.map<string>((type: CardType) => CardType[type]).join(' - ');
    }

    get color(): string {
        const orderedPrimaryCardTypes = [
            CardType.Duration,
            CardType.Treasure,
            CardType.Reserve,
            CardType.Victory,
            CardType.Reaction,
            CardType.Shelter,
            CardType.Event,
            CardType.Ruins,
            CardType.Landmark,
            CardType.Project,
            CardType.Way,
        ];
        const orderedSecondaryCardTypes = [CardType.Action, CardType.Night];

        const primaryCardTypes = orderedPrimaryCardTypes.filter((cardType: CardType) =>
            this.card.types.includes(cardType),
        );
        const secondaryCardTypes = orderedSecondaryCardTypes.filter((cardType: CardType) =>
            this.card.types.includes(cardType),
        );

        // exception rules
        if (
            secondaryCardTypes[0] === CardType.Action &&
            (primaryCardTypes[0] === CardType.Treasure ||
                primaryCardTypes[0] === CardType.Victory ||
                primaryCardTypes[0] === CardType.Shelter)
        ) {
            return this.calculateColor(secondaryCardTypes[0], primaryCardTypes[0]);
        }

        // general rules
        if (primaryCardTypes.length === 1) {
            return this.calculateColor(primaryCardTypes[0]);
        }
        if (primaryCardTypes.length > 1) {
            return this.calculateColor(primaryCardTypes[0], primaryCardTypes[1]);
        }

        return this.calculateColor(secondaryCardTypes[0]);
    }

    private calculateColor(topCardType: CardType, bottomCardType?: CardType): string {
        const topColor = CardComponent.colorOfCardTypes.get(topCardType);
        const bottomColor = bottomCardType
            ? CardComponent.colorOfCardTypes.get(bottomCardType)
            : undefined;

        if (topColor && bottomColor) {
            return `linear-gradient(${topColor} 50%, ${bottomColor} 50%)`;
        }
        if (topColor) {
            return topColor;
        }

        return '';
    }
}
