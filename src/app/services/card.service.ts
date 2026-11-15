import { CardTranslation } from 'src/app/models/card';
import { CardDto } from './../dtos/card-dto';
import { Injectable, inject } from '@angular/core';
import { CardType, CardTypeId } from '../models/card-type';
import { Card } from '../models/card';
import { DataService } from './data.service';
import { EditionService } from './edition.service';
import { Edition } from '../models/edition';
import { CardTypeService } from './card-type.service';

@Injectable({
    providedIn: 'root',
})
export class CardService {
    private dataService = inject(DataService);
    private editionService = inject(EditionService);
    private cardTypeService = inject(CardTypeService);

    readonly cards: Map<string, Card> = this.mapCardDtosToCards(
        this.translate(this.dataService.getCards(), this.dataService.getCardTranslations()),
        this.editionService.editions,
        this.cardTypeService.cardTypes,
    );

    private translate(cardDtos: CardDto[], translations: CardTranslation[]): CardDto[] {
        return cardDtos.map((cardDto: CardDto) => {
            const translation = translations.find(
                (translation: CardTranslation) => translation.id === cardDto.id,
            );
            if (translation === undefined) {
                return cardDto;
            }

            return {
                ...cardDto,
                name: translation.name.trim().length > 0 ? translation.name : cardDto.name,
                description:
                    translation.description.trim().length > 0
                        ? translation.description
                        : cardDto.description,
            };
        });
    }

    private mapCardDtosToCards(
        cardDtos: CardDto[],
        editions: Edition[],
        cardTypes: CardType[],
    ): Map<string, Card> {
        const cards = new Map<string, Card>();

        cardDtos.forEach((cardDto: CardDto) => {
            cards.set(cardDto.id, {
                ...cardDto,
                editions: editions.filter((edition: Edition) =>
                    cardDto.editions.includes(edition.id),
                ),
                types: cardTypes.filter((cardType: CardType) =>
                    cardDto.types.includes(cardType.id),
                ),
            });
        });

        return cards;
    }

    findRandomizableKingdomCards(): Card[] {
        return Array.from(this.cards.values()).filter((card: Card) => card.isKingdomCard);
    }

    findByCardType(typeId: CardTypeId): Card[] {
        return Array.from(this.cards.values()).filter((card: Card) =>
            card.types.some((type: CardType) => type.id === typeId),
        );
    }
}
