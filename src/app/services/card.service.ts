import { Injectable } from '@angular/core';
import { CardType } from '../models/card-type';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { Card } from '../models/card';
import { map, first } from 'rxjs/operators';
import { DataService } from './data.service';
import { ExpansionService } from './expansion.service';
import { CardDto } from '../dtos/card-dto';
import { Expansion } from '../models/expansion';

@Injectable({
    providedIn: 'root',
})
export class CardService {
    private cardsSubject: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

    readonly cards$: Observable<Card[]> = this.cardsSubject.pipe(
        first((cards: Card[]) => cards.length !== 0),
    );

    constructor(private dataService: DataService, private expansionService: ExpansionService) {
        forkJoin([
            this.dataService.fetchCards(),
            this.expansionService.expansions$,
        ]).subscribe((data: [CardDto[], Expansion[]]) =>
            this.cardsSubject.next(this.mapCardDtosToCards(data)),
        );
    }

    private mapCardDtosToCards(data: [CardDto[], Expansion[]]): Card[] {
        const [cardDtos, expansions] = data;

        return cardDtos.map((cardDto: CardDto) => {
            return {
                ...cardDto,
                expansions: expansions.filter((expansion: Expansion) =>
                    cardDto.expansions.includes(expansion.id),
                ),
            };
        });
    }

    findRandomizableKingdomCards(): Observable<Card[]> {
        return this.cards$.pipe(
            map((cards: Card[]) =>
                cards.filter((card: Card) => {
                    const cardIsBelowOfSplitPile =
                        card.isPartOfSplitPile && !card.isOnTopOfSplitPile;

                    return card.isKingdomCard && !cardIsBelowOfSplitPile;
                }),
            ),
        );
    }

    findByCardType(type: CardType): Observable<Card[]> {
        return this.cards$.pipe(
            map((cards: Card[]) => cards.filter((card: Card) => card.types.includes(type))),
        );
    }
}
