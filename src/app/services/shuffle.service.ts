import { SetService } from 'src/app/services/set.service';
import { CardType } from 'src/app/models/card-type';
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

interface RandomizableCards {
    kingdomCards: Card[];
    events: Card[];
    landmarks: Card[];
    projects: Card[];
    ways: Card[];
}

@Injectable({
    providedIn: 'root',
})
export class ShuffleService {
    private shuffleSetTriggerSubject = new Subject<void>();
    private shuffleSingleCardTriggerSubject = new Subject<Card>();

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
            specialCards: [
                ...this.pickRandomCards(
                    randomizableCards.events,
                    configuration.expansions,
                    configuration.specialCardsCount.events,
                ),
                ...this.pickRandomCards(
                    randomizableCards.landmarks,
                    configuration.expansions,
                    configuration.specialCardsCount.landmarks,
                ),
                ...this.pickRandomCards(
                    randomizableCards.projects,
                    configuration.expansions,
                    configuration.specialCardsCount.projects,
                ),
                ...this.pickRandomCards(
                    randomizableCards.ways,
                    configuration.expansions,
                    configuration.specialCardsCount.ways,
                ),
            ],
        };
    }

    private initShuffleSingleCard(): Observable<void> {
        return this.shuffleSingleCardTriggerSubject.pipe(
            withLatestFrom(
                this.randomizableCards$,
                this.configurationService.configuration$,
                this.setService.set$,
                (
                    oldCard: Card,
                    randomizableCards: RandomizableCards,
                    configuration: Configuration,
                    currentSet: Set,
                ) => this.pickRandomCard(oldCard, randomizableCards, configuration, currentSet),
            ),
            map(([oldCard, newCard]) => this.setService.updateSingleCard(oldCard, newCard)),
        );
    }

    private pickRandomCard(
        oldCard: Card,
        randomizableCards: RandomizableCards,
        configuration: Configuration,
        currentSet: Set,
    ): [Card, Card] {
        const candidates = this.determineCandidatesFromOldCard(oldCard, randomizableCards);
        const costDistribution = oldCard.isKingdomCard ? configuration.costDistribution : undefined;
        const cardsToIgnore = oldCard.isKingdomCard
            ? currentSet.kingdomCards
            : currentSet.specialCards;

        const newCard = this.pickRandomCards(
            candidates,
            configuration.expansions,
            1,
            costDistribution,
            cardsToIgnore,
        )[0];

        return [oldCard, newCard];
    }

    private determineCandidatesFromOldCard(
        oldCard: Card,
        randomizableCards: RandomizableCards,
    ): Card[] {
        const candidatesPerCardType: Map<CardType, Card[]> = new Map([
            [CardType.Event, randomizableCards.events],
            [CardType.Landmark, randomizableCards.landmarks],
            [CardType.Project, randomizableCards.projects],
            [CardType.Way, randomizableCards.ways],
        ]);

        for (const [cardType, candidates] of candidatesPerCardType) {
            if (oldCard.types.some((type) => type === cardType)) {
                return candidates;
            }
        }

        return randomizableCards.kingdomCards;
    }

    private pickRandomCards(
        candidates: Card[],
        expansions: Expansion[],
        count: number,
        costDistribution?: Map<number, number>,
        cardsToIgnore: Card[] = [],
    ): Card[] {
        if (count === 0) {
            return [];
        }

        candidates = this.filterByExpansions(candidates, expansions);
        candidates = this.excludeCardsToIgnore(candidates, cardsToIgnore);
        const weights = this.calculateCardWeights(candidates, costDistribution);

        return this.mathService.pickRandomCards(candidates, count, weights);
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
        costDistribution?: Map<number, number>,
    ): number[] | undefined {
        if (!costDistribution) {
            return undefined;
        }
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
            const costCount = cardsAggregatedByCost.get(card.cost) as number;
            return costWeight / costCount;
        });
    }

    shuffleSet(): void {
        this.shuffleSetTriggerSubject.next();
    }

    shuffleSingleCard(card: Card): void {
        this.shuffleSingleCardTriggerSubject.next(card);
    }
}
