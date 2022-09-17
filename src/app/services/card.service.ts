import { DependencyDto } from './../dtos/dependency-dto';
import { CardDto } from './../dtos/card-dto';
import { Dependency, DependencyType, SplitPileDependency } from './../models/dependency';
import { Injectable } from '@angular/core';
import { CardType, CardTypeId } from '../models/card-type';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { Card } from '../models/card';
import { map, first } from 'rxjs/operators';
import { DataService } from './data.service';
import { ExpansionService } from './expansion.service';
import { Expansion } from '../models/expansion';
import { CardTypeService } from './card-type.service';

@Injectable({
    providedIn: 'root',
})
export class CardService {
    private cardsSubject: BehaviorSubject<Map<number, Card>> = new BehaviorSubject<
        Map<number, Card>
    >(new Map());

    get cards$(): Observable<Map<number, Card>> {
        return this.cardsSubject.pipe(first((cards: Map<number, Card>) => cards.size !== 0));
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
    ): Map<number, Card> {
        const cardDtosWithDependencies: CardDto[] = [];
        const cards: Map<number, Card> = new Map();

        cardDtos.forEach((cardDto: CardDto) => {
            if (cardDto.dependencies !== undefined) {
                cardDtosWithDependencies.push(cardDto);
            }

            cards.set(cardDto.id, {
                ...cardDto,
                expansions: expansions.filter((expansion: Expansion) =>
                    cardDto.expansions.includes(expansion.id),
                ),
                types: cardTypes.filter((cardType: CardType) =>
                    cardDto.types.includes(cardType.id),
                ),
                dependencies: undefined,
            });
        });

        cardDtosWithDependencies.forEach((cardDto: CardDto) => {
            const card = cards.get(cardDto.id);

            if (card === undefined || cardDto.dependencies === undefined) {
                return;
            }

            const dependencies: SplitPileDependency[] = cardDto.dependencies.map(
                (dependency: DependencyDto) => {
                    // TODO: respect different types of dependencies
                    const card = cards.get(dependency.id);

                    return {
                        card: card,
                        type: DependencyType.SplitPile,
                    } as SplitPileDependency;
                },
            );

            card.dependencies = dependencies;
        });

        return cards;
    }

    findRandomizableKingdomCards(): Observable<Card[]> {
        return this.cards$.pipe(
            map((cards: Map<number, Card>) =>
                Array.from(cards.values()).filter((card: Card) => {
                    if (!card.isKingdomCard) {
                        return false;
                    }

                    if (card.dependencies === undefined) {
                        return true;
                    }

                    // TODO: respect different types of dependencies
                    const splitPileDependencies = card.dependencies?.filter(
                        (dependency: Dependency) => dependency.type === DependencyType.SplitPile,
                    ) as SplitPileDependency[];

                    if (splitPileDependencies?.length === 0) {
                        return true;
                    }

                    return splitPileDependencies?.some(
                        (splitPileDependency: SplitPileDependency) =>
                            splitPileDependency.card.id === card.id,
                    );
                }),
            ),
        );
    }

    findByCardType(typeId: CardTypeId): Observable<Card[]> {
        return this.cards$.pipe(
            map((cards: Map<number, Card>) =>
                Array.from(cards.values()).filter((card: Card) =>
                    card.types.some((type: CardType) => type.id === typeId),
                ),
            ),
        );
    }
}
