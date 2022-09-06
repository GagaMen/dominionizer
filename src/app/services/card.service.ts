import { Injectable } from '@angular/core';
import { CardType, CardTypeId } from '../models/card-type';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { Card } from '../models/card';
import { map, first } from 'rxjs/operators';
import { DataService } from './data.service';
import { ExpansionService } from './expansion.service';
import { CardDto } from '../dtos/card-dto';
import { Expansion } from '../models/expansion';
import { CardTypeService } from './card-type.service';

@Injectable({
    providedIn: 'root',
})
export class CardService {
    private cardsSubject: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

    get cards$(): Observable<Card[]> {
        return this.cardsSubject.pipe(first((cards: Card[]) => cards.length !== 0));
    }

    constructor(
        private dataService: DataService,
        private expansionService: ExpansionService,
        private cardTypeService: CardTypeService,
    ) {
        forkJoin({
            cardDtos: this.dataService.fetchCards(),
            expansions: this.expansionService.expansions$,
            cardTypes: this.cardTypeService.cardTypes$,
        }).subscribe(({ cardDtos, expansions, cardTypes }) =>
            this.cardsSubject.next(this.mapCardDtosToCards(cardDtos, expansions, cardTypes)),
        );
    }

    private mapCardDtosToCards(
        cardDtos: CardDto[],
        expansions: Expansion[],
        cardTypes: CardType[],
    ): Card[] {
        return cardDtos.map((cardDto: CardDto) => {
            const card: Card = {
                ...cardDto,
                expansions: expansions.filter((expansion: Expansion) =>
                    cardDto.expansions.includes(expansion.id),
                ),
                types: cardTypes.filter((cardType: CardType) =>
                    cardDto.types.includes(cardType.id),
                ),
                dependencies: undefined,
            };
            return card;
        });
    }

    findRandomizableKingdomCards(): Observable<Card[]> {
        return this.cards$.pipe(
            // TODO: respect split piles
            map((cards: Card[]) => cards.filter((card: Card) => card.isKingdomCard)),
        );
    }

    findByCardType(typeId: CardTypeId): Observable<Card[]> {
        return this.cards$.pipe(
            map((cards: Card[]) =>
                cards.filter((card: Card) =>
                    card.types.some((type: CardType) => type.id === typeId),
                ),
            ),
        );
    }
}
