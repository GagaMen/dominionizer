import { SetService } from 'src/app/services/set.service';
import { CardType } from 'src/app/models/card-type';
import { SetPartName } from './../models/set';
import { ConfigurationService } from './configuration.service';
import { Configuration } from './../models/configuration';
import { Injectable } from '@angular/core';
import { Card } from '../models/card';
import { Observable, of, iif, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Expansion } from '../models/expansion';
import { MathJsService } from './math-js.service';
import { CardService } from './card.service';
import { Set } from '../models/set';

@Injectable({
    providedIn: 'root',
})
export class ShuffleService {
    configuration: Configuration = {
        expansions: [],
        options: { events: 0, landmarks: 0, projects: 0, ways: 0 },
        costDistribution: new Map(),
    };

    set: Set = {
        cards: [],
        events: [],
        landmarks: [],
        projects: [],
        ways: [],
    };

    private mapping: Map<SetPartName, CardType> = new Map([
        ['events', CardType.Event],
        ['landmarks', CardType.Landmark],
        ['projects', CardType.Project],
        ['ways', CardType.Way],
    ]);

    constructor(
        private cardService: CardService,
        private configurationService: ConfigurationService,
        private mathJsService: MathJsService,
        private setService: SetService,
    ) {
        this.configurationService.configuration$.subscribe(
            (configuration: Configuration) => (this.configuration = configuration),
        );

        this.setService.set$.subscribe((set: Set) => (this.set = set));
    }

    shuffleCards(): void {
        forkJoin({
            cards: this.shuffleKingdomCards(),
            events: this.shuffleSpecialCards(
                CardType.Event,
                (configuration: Configuration) => configuration.options.events,
            ),
            landmarks: this.shuffleSpecialCards(
                CardType.Landmark,
                (configuration: Configuration) => configuration.options.landmarks,
            ),
            projects: this.shuffleSpecialCards(
                CardType.Project,
                (configuration: Configuration) => configuration.options.projects,
            ),
            ways: this.shuffleSpecialCards(
                CardType.Way,
                (configuration: Configuration) => configuration.options.ways,
            ),
        }).subscribe((set: Set) => this.setService.updateSet(set));
    }

    shuffleSingleCard(card: Card, setPartName: SetPartName): void {
        let newCard$;
        if (setPartName === 'cards') {
            newCard$ = this.shuffleKingdomCards(1, this.set.cards);
        } else {
            const cardType = this.mapping.get(setPartName) as CardType;
            newCard$ = this.shuffleSpecialCards(
                cardType,
                (configuration: Configuration) => configuration.options[setPartName],
                1,
                this.set[setPartName],
            );
        }

        newCard$.subscribe((cards: Card[]) => {
            const newCard: Card = cards[0];
            this.setService.updateSingleCard(card, newCard, setPartName);
        });
    }

    private shuffleKingdomCards(amount = 10, cardsToIgnore: Card[] = []): Observable<Card[]> {
        return this.cardService.findRandomizableKingdomCards().pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) => this.excludeCardsToIgnore(cards, cardsToIgnore)),
            map((cards: Card[]) =>
                this.mathJsService.pickRandomCards(cards, amount, this.calculateCardWeights(cards)),
            ),
        );
    }

    private shuffleSpecialCards(
        cardType: CardType,
        getSpecialCardsFromConfiguration: (configuration: Configuration) => number,
        amount: number | null = null,
        cardsToIgnore: Card[] = [],
    ): Observable<Card[]> {
        const nonNullAmount = amount ?? getSpecialCardsFromConfiguration(this.configuration);
        const cards$ = this.cardService.findByCardType(cardType).pipe(
            map((cards: Card[]) => this.filterByExpansions(cards)),
            map((cards: Card[]) => this.excludeCardsToIgnore(cards, cardsToIgnore)),
            map((cards: Card[]) => this.mathJsService.pickRandomCards(cards, nonNullAmount)),
        );

        return iif(() => nonNullAmount > 0, cards$, of([]));
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

    private excludeCardsToIgnore(cards: Card[], cardsToIgnore: Card[]): Card[] {
        return cards.filter((card: Card) => !cardsToIgnore.includes(card));
    }
}
