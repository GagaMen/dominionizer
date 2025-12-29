import { SetService } from 'src/app/services/set.service';
import { CardType, CardTypeId } from 'src/app/models/card-type';
import { ConfigurationService } from './configuration.service';
import { Configuration } from './../models/configuration';
import { Injectable, inject } from '@angular/core';
import { Card } from '../models/card';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Expansion } from '../models/expansion';
import { ChanceService } from './chance.service';
import { CardService } from './card.service';
import { Set } from '../models/set';

interface RandomizableCards {
    kingdomCards: Card[];
    events: Card[];
    landmarks: Card[];
    projects: Card[];
    ways: Card[];
    traits: Card[];
    allies: Card[];
}

@Injectable({
    providedIn: 'root',
})
export class ShuffleService {
    private cardService = inject(CardService);
    private configurationService = inject(ConfigurationService);
    private chanceService = inject(ChanceService);
    private setService = inject(SetService);

    private shuffleSetTriggerSubject = new Subject<void>();
    private shuffleSingleCardTriggerSubject = new Subject<Card>();

    private randomizableCards$: Observable<RandomizableCards> = forkJoin({
        kingdomCards: this.cardService.findRandomizableKingdomCards(),
        events: this.cardService.findByCardType(CardTypeId.Event),
        landmarks: this.cardService.findByCardType(CardTypeId.Landmark),
        projects: this.cardService.findByCardType(CardTypeId.Project),
        ways: this.cardService.findByCardType(CardTypeId.Way),
        traits: this.cardService.findByCardType(CardTypeId.Trait),
        allies: this.cardService.findByCardType(CardTypeId.Ally),
    });

    constructor() {
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
        const kingdomCards = this.pickRandomCards(
            randomizableCards.kingdomCards,
            configuration.expansions,
            10,
        );
        const containsCardOfTypeLiaison = this.containsCardOfType(kingdomCards, CardTypeId.Liaison);
        const allies: Card[] = containsCardOfTypeLiaison
            ? this.pickRandomCards(randomizableCards.allies, configuration.expansions, 1, [])
            : [];

        return {
            kingdomCards,
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
                ...this.pickRandomCards(
                    randomizableCards.traits,
                    configuration.expansions,
                    configuration.specialCardsCount.traits,
                ),
                ...allies,
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
                ) => {
                    const newCard = this.pickRandomCard(
                        oldCard,
                        randomizableCards,
                        configuration,
                        currentSet,
                    );
                    this.updateSingleCard(currentSet, oldCard, newCard);
                    this.updateAllyCard(currentSet, randomizableCards, configuration);

                    return currentSet;
                },
            ),
            map((set: Set) => this.setService.updateSet(set)),
        );
    }

    private pickRandomCard(
        oldCard: Card,
        randomizableCards: RandomizableCards,
        configuration: Configuration,
        currentSet: Set,
    ): Card {
        const candidates = this.determineCandidatesFromOldCard(oldCard, randomizableCards);
        const cardsToIgnore = oldCard.isKingdomCard
            ? currentSet.kingdomCards
            : currentSet.specialCards;

        return this.pickRandomCards(candidates, configuration.expansions, 1, cardsToIgnore)[0];
    }

    private determineCandidatesFromOldCard(
        oldCard: Card,
        randomizableCards: RandomizableCards,
    ): Card[] {
        const candidatesPerCardType: Map<CardTypeId, Card[]> = new Map([
            [CardTypeId.Event, randomizableCards.events],
            [CardTypeId.Landmark, randomizableCards.landmarks],
            [CardTypeId.Project, randomizableCards.projects],
            [CardTypeId.Way, randomizableCards.ways],
            [CardTypeId.Trait, randomizableCards.traits],
            [CardTypeId.Ally, randomizableCards.allies],
        ]);

        for (const [typeId, candidates] of candidatesPerCardType) {
            if (oldCard.types.some((type: CardType) => type.id === typeId)) {
                return candidates;
            }
        }

        return randomizableCards.kingdomCards;
    }

    private updateSingleCard(set: Set, oldCard: Card, newCard: Card | undefined): void {
        const setPart: Card[] = oldCard.isKingdomCard ? set.kingdomCards : set.specialCards;
        const cardIndex = setPart.indexOf(oldCard);

        if (newCard === undefined) {
            setPart.splice(cardIndex, 1);
            return;
        }

        setPart[cardIndex] = newCard;
    }

    private updateAllyCard(
        currentSet: Set,
        randomizableCards: RandomizableCards,
        configuration: Configuration,
    ): void {
        const allyCard = currentSet.specialCards.find((card) =>
            card.types.some((type) => type.id === CardTypeId.Ally),
        );
        const containsCardOfTypeLiaison = this.containsCardOfType(
            currentSet.kingdomCards,
            CardTypeId.Liaison,
        );

        if (containsCardOfTypeLiaison && allyCard === undefined) {
            const allyCard = this.pickRandomCards(
                randomizableCards.allies,
                configuration.expansions,
                1,
                [],
            )[0];

            currentSet.specialCards.push(allyCard);
        }

        if (!containsCardOfTypeLiaison && allyCard !== undefined) {
            this.updateSingleCard(currentSet, allyCard, undefined);
        }
    }

    private containsCardOfType(cards: Card[], cardTypeId: CardTypeId) {
        return cards.some((card: Card) =>
            card.types.some((cardType: CardType) => cardType.id === cardTypeId),
        );
    }

    private pickRandomCards(
        candidates: Card[],
        expansions: Expansion[],
        count: number,
        cardsToIgnore: Card[] = [],
    ): Card[] {
        if (count === 0) {
            return [];
        }

        candidates = this.filterByExpansions(candidates, expansions);
        candidates = this.excludeCardsToIgnore(candidates, cardsToIgnore);

        return this.chanceService.pickCards(candidates, count);
    }

    private filterByExpansions(cards: Card[], expansions: Expansion[]): Card[] {
        return cards.filter((card: Card) =>
            card.expansions.some((expansion: Expansion) => expansions.includes(expansion)),
        );
    }

    private excludeCardsToIgnore(cards: Card[], cardsToIgnore: Card[]): Card[] {
        return cards.filter((card: Card) => !cardsToIgnore.includes(card));
    }

    shuffleSet(): void {
        this.shuffleSetTriggerSubject.next();
    }

    shuffleSingleCard(card: Card): void {
        this.shuffleSingleCardTriggerSubject.next(card);
    }
}
