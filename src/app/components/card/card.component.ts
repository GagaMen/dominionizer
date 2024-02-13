import { environment } from './../../../environments/environment';
import { Card, NullCard } from './../../models/card';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardType, CardTypeId } from 'src/app/models/card-type';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import {
    MatCard,
    MatCardHeader,
    MatCardTitleGroup,
    MatCardTitle,
    MatCardSubtitle,
} from '@angular/material/card';

type RGB = {
    red: number;
    green: number;
    blue: number;
};

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitleGroup,
        MatCardTitle,
        MatCardSubtitle,
        MatIconButton,
        MatIcon,
        NgIf,
        NgFor,
    ],
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent {
    private orderedPrimaryCardTypes: CardTypeId[] = [
        CardTypeId.Treasure,
        CardTypeId.Duration,
        CardTypeId.Reserve,
        CardTypeId.Victory,
        CardTypeId.Reaction,
        CardTypeId.Shelter,
        CardTypeId.Event,
        CardTypeId.Ruins,
        CardTypeId.Landmark,
        CardTypeId.Project,
        CardTypeId.Way,
        CardTypeId.Trait,
        CardTypeId.Ally,
    ];

    private orderedSecondaryCardTypes: CardTypeId[] = [CardTypeId.Action, CardTypeId.Night];

    static readonly backgroundOfCardTypes: Map<CardTypeId, string> = new Map([
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
        [CardTypeId.Trait, '#cbc9e1'],
        [CardTypeId.Ally, '#ddc6a7'],
    ]);

    @Input() card: Card = NullCard;
    @Output() reshuffle: EventEmitter<undefined> = new EventEmitter<undefined>();

    get expansionIconUrl(): string | null {
        // since the expansions are sorted in the data source we get the latest expansion this way
        const icon = this.card.expansions[this.card.expansions.length - 1]?.icon;
        return icon ? `${environment.entryPoint}/assets/card_symbols/${icon}` : null;
    }

    get costIconUrls(): string[] {
        const baseUrl = `${environment.entryPoint}/assets/card_symbols`;
        const urls: string[] = [];

        if (this.shouldDisplayBasicCostIcon()) {
            urls.push(`${baseUrl}/Coin${this.card.cost}.png`);
        }

        switch (this.card.costModifier) {
            case 'P':
                urls.push(`${baseUrl}/Potion.png`);
                break;
            case '*':
                urls.push(`${baseUrl}/Coin${this.card.cost}star.png`);
                break;
            case '+':
                urls.push(`${baseUrl}/Coin${this.card.cost}plus.png`);
                break;
        }

        if (this.card.debt) {
            urls.push(`${baseUrl}/Debt${this.card.debt}.png`);
        }

        return urls;
    }

    private shouldDisplayBasicCostIcon() {
        if (this.card.costModifier === 'P' && this.card.cost === 0) {
            return false;
        }

        if (this.card.costModifier && this.card.costModifier !== 'P') {
            return false;
        }

        if (this.card.debt && this.card.cost === 0) {
            return false;
        }

        return true;
    }

    get typesLabel(): string {
        return this.card.types.map<string>((type: CardType) => type.name).join(' - ');
    }

    get background(): string {
        const primaryCardTypes = this.orderedPrimaryCardTypes.filter((typeId: CardTypeId) =>
            this.card.types.some((type: CardType) => type.id === typeId),
        );
        const secondaryCardTypes = this.orderedSecondaryCardTypes.filter((typeId: CardTypeId) =>
            this.card.types.some((type: CardType) => type.id === typeId),
        );

        // exception rules
        if (
            secondaryCardTypes[0] === CardTypeId.Action &&
            (primaryCardTypes[0] === CardTypeId.Treasure ||
                primaryCardTypes[0] === CardTypeId.Victory ||
                primaryCardTypes[0] === CardTypeId.Shelter)
        ) {
            return this.calculateBackground(secondaryCardTypes[0], primaryCardTypes[0]);
        }

        // general rules
        if (primaryCardTypes.length === 1) {
            return this.calculateBackground(primaryCardTypes[0]);
        }
        if (primaryCardTypes.length > 1) {
            return this.calculateBackground(primaryCardTypes[0], primaryCardTypes[1]);
        }

        return this.calculateBackground(secondaryCardTypes[0]);
    }

    private calculateBackground(topCardType: CardTypeId, bottomCardType?: CardTypeId): string {
        const topColor = CardComponent.backgroundOfCardTypes.get(topCardType);
        const bottomColor = bottomCardType
            ? CardComponent.backgroundOfCardTypes.get(bottomCardType)
            : undefined;

        if (topColor && bottomColor) {
            return `linear-gradient(${topColor} 50%, ${bottomColor} 50%)`;
        }
        if (topColor) {
            return topColor;
        }

        return '';
    }

    get titleColor(): string {
        const baseColor = this.calculateBaseColor();

        return `rgba(${baseColor.red}, ${baseColor.green}, ${baseColor.blue}, 0.87)`;
    }

    get subtitleColor(): string {
        const baseColor = this.calculateBaseColor();

        return `rgba(${baseColor.red}, ${baseColor.green}, ${baseColor.blue}, 0.54)`;
    }

    private calculateBaseColor(): RGB {
        const containsTypeNight = this.card.types.some(
            (cardType: CardType) => cardType.id === CardTypeId.Night,
        );
        const containsPrimaryType = this.card.types.some(
            (cardType: CardType) =>
                this.orderedPrimaryCardTypes.includes(cardType.id) ||
                cardType.id === CardTypeId.Action,
        );

        if (containsTypeNight && !containsPrimaryType) {
            return { red: 255, green: 255, blue: 255 };
        }

        return { red: 0, green: 0, blue: 0 };
    }
}
