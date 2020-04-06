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
        options: { events: 0, landmarks: 0, projects: 0, ways: 0 },
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

    shuffleKingdomCards(amount = 10): Observable<Card[]> {
        return this.cardService.findRandomizableKingdomCards().pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) =>
                this.mathJsService.pickRandomCards(cards, amount, this.calculateCardWeights(cards)),
            ),
        );
    }

    shuffleEvents(): Observable<Card[]> {
        const events$ = this.cardService.findByCardType(CardType.Event).pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) =>
                this.mathJsService.pickRandomCards(cards, this.configuration.options.events),
            ),
        );

        return iif(() => this.configuration.options.events > 0, events$, of([]));
    }

    shuffleLandmarks(): Observable<Card[]> {
        const landmarks$ = this.cardService.findByCardType(CardType.Landmark).pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) =>
                this.mathJsService.pickRandomCards(cards, this.configuration.options.landmarks),
            ),
        );

        return iif(() => this.configuration.options.landmarks > 0, landmarks$, of([]));
    }

    shuffleProjects(): Observable<Card[]> {
        const projects$ = this.cardService.findByCardType(CardType.Project).pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) =>
                this.mathJsService.pickRandomCards(cards, this.configuration.options.projects),
            ),
        );

        return iif(() => this.configuration.options.projects > 0, projects$, of([]));
    }

    shuffleWays(): Observable<Card[]> {
        const ways$ = this.cardService.findByCardType(CardType.Way).pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) =>
                this.mathJsService.pickRandomCards(cards, this.configuration.options.ways),
            ),
        );

        return iif(() => this.configuration.options.ways > 0, ways$, of([]));
    }

    private calculateCardWeights(cards: Card[]): number[] | undefined {
        if (this.configuration.costDistribution.size === 0) {
            return undefined;
        }

        const cardsAggregatedByCost = cards.reduce<Map<number, number>>(
            (aggregation: Map<number, number>, card: Card) => {
                const costCount = aggregation.get(card.cost) ?? 0;
                aggregation.set(card.cost, costCount + 1);
                return aggregation;
            },
            new Map<number, number>(),
        );

        return cards.map((card: Card) => {
            const costWeight = this.configuration.costDistribution.get(card.cost) ?? 0;
            const costCount = cardsAggregatedByCost.get(card.cost);
            return costCount !== undefined ? costWeight / costCount : 0;
        });
    }

    private filterByExpansions(cards: Card[]): Card[] {
        return cards.filter((card: Card) =>
            card.expansions.some((expansion: Expansion) =>
                this.configuration.expansions.includes(expansion),
            ),
        );
    }
}
