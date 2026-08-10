import { SetService } from 'src/app/services/set.service';
import { CardType, CardTypeId } from 'src/app/models/card-type';
import { ConfigurationService } from './configuration.service';
import { Configuration } from './../models/configuration';
import { Injectable, inject } from '@angular/core';
import { Card } from '../models/card';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Edition } from '../models/edition';
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
    prophecies: Card[];
}

interface DependentSpecialCardRule {
    dependentCardTypeId: CardTypeId;
    triggeringCardTypeId: CardTypeId;
    getCandidates: (randomizableCards: RandomizableCards) => Card[];
}

@Injectable({
    providedIn: 'root',
})
export class ShuffleService {
    private static readonly dependentSpecialCardRules: DependentSpecialCardRule[] = [
        {
            dependentCardTypeId: CardTypeId.Ally,
            triggeringCardTypeId: CardTypeId.Liaison,
            getCandidates: (randomizableCards: RandomizableCards) => randomizableCards.allies,
        },
        {
            dependentCardTypeId: CardTypeId.Prophecy,
            triggeringCardTypeId: CardTypeId.Omen,
            getCandidates: (randomizableCards: RandomizableCards) => randomizableCards.prophecies,
        },
    ];

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
        prophecies: this.cardService.findByCardType(CardTypeId.Prophecy),
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
            configuration.editions,
            10,
        );
        const dependentSpecialCards = this.pickDependentSpecialCards(
            kingdomCards,
            randomizableCards,
            configuration,
        );

        return {
            kingdomCards,
            specialCards: [
                ...this.pickRandomCards(
                    randomizableCards.events,
                    configuration.editions,
                    configuration.specialCardsCount.events,
                ),
                ...this.pickRandomCards(
                    randomizableCards.landmarks,
                    configuration.editions,
                    configuration.specialCardsCount.landmarks,
                ),
                ...this.pickRandomCards(
                    randomizableCards.projects,
                    configuration.editions,
                    configuration.specialCardsCount.projects,
                ),
                ...this.pickRandomCards(
                    randomizableCards.ways,
                    configuration.editions,
                    configuration.specialCardsCount.ways,
                ),
                ...this.pickRandomCards(
                    randomizableCards.traits,
                    configuration.editions,
                    configuration.specialCardsCount.traits,
                ),
                ...dependentSpecialCards,
            ],
        };
    }

    private pickDependentSpecialCards(
        kingdomCards: Card[],
        randomizableCards: RandomizableCards,
        configuration: Configuration,
    ): Card[] {
        return ShuffleService.dependentSpecialCardRules.flatMap((rule: DependentSpecialCardRule) =>
            this.containsCardOfType(kingdomCards, rule.triggeringCardTypeId)
                ? this.pickRandomCards(
                      rule.getCandidates(randomizableCards),
                      configuration.editions,
                      1,
                      [],
                  )
                : [],
        );
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
                    this.updateDependentSpecialCards(currentSet, randomizableCards, configuration);

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

        return this.pickRandomCards(candidates, configuration.editions, 1, cardsToIgnore)[0];
    }

    private determineCandidatesFromOldCard(
        oldCard: Card,
        randomizableCards: RandomizableCards,
    ): Card[] {
        const candidatesPerCardType = new Map<CardTypeId, Card[]>([
            [CardTypeId.Event, randomizableCards.events],
            [CardTypeId.Landmark, randomizableCards.landmarks],
            [CardTypeId.Project, randomizableCards.projects],
            [CardTypeId.Way, randomizableCards.ways],
            [CardTypeId.Trait, randomizableCards.traits],
            ...ShuffleService.dependentSpecialCardRules.map(
                (rule: DependentSpecialCardRule): [CardTypeId, Card[]] => [
                    rule.dependentCardTypeId,
                    rule.getCandidates(randomizableCards),
                ],
            ),
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

    private updateDependentSpecialCards(
        currentSet: Set,
        randomizableCards: RandomizableCards,
        configuration: Configuration,
    ): void {
        for (const rule of ShuffleService.dependentSpecialCardRules) {
            const dependentCard = currentSet.specialCards.find((card) =>
                card.types.some((type) => type.id === rule.dependentCardTypeId),
            );
            const containsTriggeringCard = this.containsCardOfType(
                currentSet.kingdomCards,
                rule.triggeringCardTypeId,
            );

            if (containsTriggeringCard && dependentCard === undefined) {
                const newDependentCard = this.pickRandomCards(
                    rule.getCandidates(randomizableCards),
                    configuration.editions,
                    1,
                    [],
                )[0];

                if (newDependentCard !== undefined) {
                    currentSet.specialCards.push(newDependentCard);
                }
            }

            if (!containsTriggeringCard && dependentCard !== undefined) {
                this.updateSingleCard(currentSet, dependentCard, undefined);
            }
        }
    }

    private containsCardOfType(cards: Card[], cardTypeId: CardTypeId) {
        return cards.some((card: Card) =>
            card.types.some((cardType: CardType) => cardType.id === cardTypeId),
        );
    }

    private pickRandomCards(
        candidates: Card[],
        editions: Edition[],
        count: number,
        cardsToIgnore: Card[] = [],
    ): Card[] {
        if (count === 0) {
            return [];
        }

        candidates = this.filterByEditions(candidates, editions);
        candidates = this.excludeCardsToIgnore(candidates, cardsToIgnore);

        return this.chanceService.pickCards(candidates, count);
    }

    private filterByEditions(cards: Card[], editions: Edition[]): Card[] {
        const editionIds = editions.map((edition: Edition) => edition.id);

        return cards.filter((card: Card) =>
            card.editions.some((edition: Edition) => editionIds.includes(edition.id)),
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
