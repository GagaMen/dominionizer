import { Injectable, InjectionToken, Inject } from '@angular/core';
import * as math from 'mathjs';
import { Card } from '../models/card';

export const MathJsStaticInjectionToken = new InjectionToken<math.MathJsStatic>(
    'math.MathJsStatic',
    {
        providedIn: 'root',
        factory: () => math,
    },
);

@Injectable({
    providedIn: 'root',
})
export class MathJsService {
    constructor(@Inject(MathJsStaticInjectionToken) private mathJsService: math.MathJsStatic) {}

    pickRandomCards(cards: Card[], number: number, weights?: number[]): Card[] {
        const cardIds = cards.map((card: Card) => card.id);
        const pickedCardIds = weights
            ? this.mathJsService.pickRandom(cardIds, number, weights)
            : this.mathJsService.pickRandom(cardIds, number);

        return typeof pickedCardIds === 'number'
            ? [cards.find((card: Card) => card.id === pickedCardIds) as Card]
            : (pickedCardIds.map((cardId: number) =>
                  cards.find((card: Card) => card.id === cardId),
              ) as Card[]);
    }
}
