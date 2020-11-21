import { SetService } from 'src/app/services/set.service';
import { CardType } from 'src/app/models/card-type';
import { SetPartName } from './../models/set';
import { ConfigurationService } from './configuration.service';
import { Configuration } from './../models/configuration';
import { Injectable } from '@angular/core';
import { Card } from '../models/card';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Expansion } from '../models/expansion';
import { MathService } from './math.service';
import { CardService } from './card.service';
import { Set } from '../models/set';

export interface SingleCardShuffle {
    card: Card;
    setPartName: SetPartName;
}

type RandomizableCards = Set;

@Injectable({
    providedIn: 'root',
})
export class ShuffleService {
    private shuffleSetTriggerSubject = new Subject<void>();
    private shuffleSingleCardTriggerSubject = new Subject<SingleCardShuffle>();

    private randomizableCards$: Observable<RandomizableCards> = forkJoin({
        kingdomCards: this.cardService.findRandomizableKingdomCards(),
        events: this.cardService.findByCardType(CardType.Event),
        landmarks: this.cardService.findByCardType(CardType.Landmark),
        projects: this.cardService.findByCardType(CardType.Project),
        ways: this.cardService.findByCardType(CardType.Way),
    });

    constructor(
        private cardService: CardService,
        private configurationService: ConfigurationService,
        private mathService: MathService,
        private setService: SetService,
    ) {
        this.initShuffleSet().subscribe();
        this.initShuffleSingleCard().subscribe();
    }

    private initShuffleSet(): Observable<void> {
        return this.shuffleSetTriggerSubject.pipe(
            withLatestFrom(
                this.randomizableCards$,
                this.configurationService.configuration$,
                (_, randomizableCards: RandomizableCards, configuration: Configuration) =>
                    this.pickRandomSet(randomizableCards, configuration),
            ),
            map((set: Set) => this.setService.updateSet(set)),
        );
    }

    private pickRandomSet(randomizableCards: RandomizableCards, configuration: Configuration): Set {
        return {
            kingdomCards: this.pickRandomCards(
                randomizableCards.kingdomCards,
                configuration.expansions,
                10,
                configuration.costDistribution,
            ),
            events: this.pickRandomCards(
                randomizableCards.events,
                configuration.expansions,
                configuration.options.events,
            ),
            landmarks: this.pickRandomCards(
                randomizableCards.landmarks,
                configuration.expansions,
                configuration.options.landmarks,
            ),
            projects: this.pickRandomCards(
                randomizableCards.projects,
                configuration.expansions,
                configuration.options.projects,
            ),
            ways: this.pickRandomCards(
                randomizableCards.ways,
                configuration.expansions,
                configuration.options.ways,
            ),
        };
    }

    private initShuffleSingleCard(): Observable<void> {
        return this.shuffleSingleCardTriggerSubject.pipe(
            withLatestFrom(
                this.randomizableCards$,
                this.configurationService.configuration$,
                this.setService.set$,
                (
                    shuffle: SingleCardShuffle,
                    randomizableCards: RandomizableCards,
                    configuration: Configuration,
                    currentSet: Set,
                ) => this.pickRandomCard(shuffle, randomizableCards, configuration, currentSet),
            ),
            map(([oldCard, newCard, setPartName]) =>
                this.setService.updateSingleCard(oldCard, newCard, setPartName),
            ),
        );
    }

    private pickRandomCard(
        shuffle: SingleCardShuffle,
        randomizableCards: RandomizableCards,
        configuration: Configuration,
        currentSet: Set,
    ): [Card, Card, SetPartName] {
        const costDistribution =
            shuffle.setPartName === 'kingdomCards' ? configuration.costDistribution : undefined;
        const newCard = this.pickRandomCards(
            randomizableCards[shuffle.setPartName],
            configuration.expansions,
            1,
            costDistribution,
            currentSet[shuffle.setPartName],
        )[0];

        return [shuffle.card, newCard, shuffle.setPartName];
    }

    private pickRandomCards(
        cards: Card[],
        expansions: Expansion[],
        amount: number,
        costDistribution?: Map<number, number>,
        cardsToIgnore: Card[] = [],
    ): Card[] {
        if (amount === 0) {
            return [];
        }

        cards = this.filterByExpansions(cards, expansions);
        cards = this.excludeCardsToIgnore(cards, cardsToIgnore);
        const weights = costDistribution
            ? this.calculateCardWeights(cards, costDistribution)
            : undefined;

        return this.mathService.pickRandomCards(cards, amount, weights);
    }

    private filterByExpansions(cards: Card[], expansions: Expansion[]): Card[] {
        return cards.filter((card: Card) =>
            card.expansions.some((expansion: Expansion) => expansions.includes(expansion)),
        );
    }

    private excludeCardsToIgnore(cards: Card[], cardsToIgnore: Card[]): Card[] {
        return cards.filter((card: Card) => !cardsToIgnore.includes(card));
    }

    private calculateCardWeights(
        cards: Card[],
        costDistribution: Map<number, number>,
    ): number[] | undefined {
        if (costDistribution.size === 0) {
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
            const costWeight = costDistribution.get(card.cost) ?? 0;
            const costCount = cardsAggregatedByCost.get(card.cost);
            return costCount !== undefined ? costWeight / costCount : 0;
        });
    }

    shuffleSet(): void {
        this.shuffleSetTriggerSubject.next();
    }

    shuffleSingleCard(card: Card, setPartName: SetPartName): void {
        this.shuffleSingleCardTriggerSubject.next({ card: card, setPartName: setPartName });
    }
}
