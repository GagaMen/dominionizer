import { environment } from './../../../environments/environment';
import { Card, NullCard } from './../../models/card';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardType, CardTypeId } from 'src/app/models/card-type';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent {
    static readonly colorOfCardTypes: Map<CardTypeId, string> = new Map([
        [CardTypeId.Action, '#ede4c7'],
        [CardTypeId.Duration, '#f89a43'],
        [CardTypeId.Event, '#bbbeb7'],
        [CardTypeId.Landmark, '#59ac68'],
        [CardTypeId.Night, '#5d6a73'],
        [CardTypeId.Project, '#f5afad'],
        [CardTypeId.Reaction, '#aeb1d2'],
        [CardTypeId.Reserve, '#d5bd59'],
        [CardTypeId.Ruins, '#956415'],
        [CardTypeId.Shelter, '#e58265'],
        [CardTypeId.Treasure, '#fff095'],
        [CardTypeId.Victory, '#adcd2a'],
        [CardTypeId.Way, '#d3eef9'],
    ]);

    @Input() card: Card = NullCard;
    @Output() reshuffle: EventEmitter<undefined> = new EventEmitter<undefined>();

    get expansionIconUrl(): string | null {
        const icon = this.card.expansions[0]?.icon;
        return icon ? `${environment.entryPoint}${icon}` : null;
    }

    get typesLabel(): string {
        return this.card.types.map<string>((type: CardType) => type.name).join(' - ');
    }

    get color(): string {
        const orderedPrimaryCardTypes = [
            CardTypeId.Duration,
            CardTypeId.Treasure,
            CardTypeId.Reserve,
            CardTypeId.Victory,
            CardTypeId.Reaction,
            CardTypeId.Shelter,
            CardTypeId.Event,
            CardTypeId.Ruins,
            CardTypeId.Landmark,
            CardTypeId.Project,
            CardTypeId.Way,
        ];
        const orderedSecondaryCardTypes = [CardTypeId.Action, CardTypeId.Night];

        const primaryCardTypes = orderedPrimaryCardTypes.filter((typeId: CardTypeId) =>
            this.card.types.some((type: CardType) => type.id === typeId),
        );
        const secondaryCardTypes = orderedSecondaryCardTypes.filter((typeId: CardTypeId) =>
            this.card.types.some((type: CardType) => type.id === typeId),
        );

        // exception rules
        if (
            secondaryCardTypes[0] === CardTypeId.Action &&
            (primaryCardTypes[0] === CardTypeId.Treasure ||
                primaryCardTypes[0] === CardTypeId.Victory ||
                primaryCardTypes[0] === CardTypeId.Shelter)
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

    private calculateColor(topCardType: CardTypeId, bottomCardType?: CardTypeId): string {
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
