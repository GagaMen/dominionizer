import { ConfigurationService } from './configuration.service';
import { Configuration } from './../models/configuration';
import { Injectable } from '@angular/core';
import { Card } from '../models/card';
import { Observable, of, iif } from 'rxjs';
import { map } from 'rxjs/operators';
import { Expansion } from '../models/expansion';
import { MathJsService } from './math-js.service';
import { CardService } from './card.service';
import { CardType } from '../models/card-type';

@Injectable({
    providedIn: 'root',
})
export class ShuffleService {
    configuration: Configuration = {
        expansions: [],
        options: { boons: 0, events: 0, hexes: 0, landmarks: 0, states: 0 },
        costDistribution: new Map(),
    };

    constructor(
        private cardService: CardService,
        private configurationService: ConfigurationService,
        private mathJsService: MathJsService,
    ) {
        this.configurationService.configuration$.subscribe(
            (configuration: Configuration) => (this.configuration = configuration),
        );
    }

    shuffleCards(amount = 10): Observable<Card[]> {
        return this.cardService.findRandomizableKingdomCards().pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) => this.pickRandomCards(cards, amount)),
        );
    }

    shuffleEvents(): Observable<Card[]> {
        const events$ = this.cardService.findByCardType(CardType.Event).pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) => this.pickRandomCards(cards, this.configuration.options.events)),
        );

        return iif(() => this.configuration.options.events > 0, events$, of([]));
    }

    shuffleLandmarks(): Observable<Card[]> {
        const landmarks$ = this.cardService.findByCardType(CardType.Landmark).pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) =>
                this.pickRandomCards(cards, this.configuration.options.landmarks),
            ),
        );

        return iif(() => this.configuration.options.landmarks > 0, landmarks$, of([]));
    }

    shuffleBoons(): Observable<Card[]> {
        const boons$ = this.cardService.findByCardType(CardType.Landmark).pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) => this.pickRandomCards(cards, this.configuration.options.boons)),
        );

        return iif(() => this.configuration.options.boons > 0, boons$, of([]));
    }

    shuffleHexes(): Observable<Card[]> {
        const hexes$ = this.cardService.findByCardType(CardType.Hex).pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) => this.pickRandomCards(cards, this.configuration.options.hexes)),
        );

        return iif(() => this.configuration.options.hexes > 0, hexes$, of([]));
    }

    shuffleStates(): Observable<Card[]> {
        const states$ = this.cardService.findByCardType(CardType.State).pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) => this.pickRandomCards(cards, this.configuration.options.states)),
        );

        return iif(() => this.configuration.options.states > 0, states$, of([]));
    }

    private pickRandomCards(cards: Card[], amount: number): Card[] {
        const cardIds = cards.map((card: Card) => card.id);
        const cardsAggregatedByCost = cards.reduce<Map<number, number>>(
            (aggregation: Map<number, number>, card: Card) => {
                const costCount = aggregation.get(card.cost) ?? 0;
                aggregation.set(card.cost, costCount + 1);
                return aggregation;
            },
            new Map<number, number>(),
        );
        const cardWeights = cards.map((card: Card) => {
            const costWeight = this.configuration.costDistribution.get(card.cost) ?? 0;
            const costCount = cardsAggregatedByCost.get(card.cost);
            return costCount !== undefined ? costWeight / costCount : 0;
        });

        const pickedCardIds = this.mathJsService.pickRandom(
            cardIds,
            amount,
            cardWeights,
        ) as number[];
        const pickedCards = pickedCardIds.map((cardId: number) =>
            cards.find((card: Card) => card.id === cardId),
        ) as Card[];

        return pickedCards;
    }

    private filterByExpansions(cards: Card[]): Card[] {
        // TODO: intermediate step, that determines the expansion ids, can be deleted when it is
        //       ensured that expansion objects exist only once in the whole app
        const expansionIds = new Set<number>();
        this.configuration.expansions.forEach((expansion: Expansion) =>
            expansionIds.add(expansion.id),
        );

        return cards.filter((card: Card) =>
            card.expansions.some((expansion: Expansion) => expansionIds.has(expansion.id)),
        );
    }
}
