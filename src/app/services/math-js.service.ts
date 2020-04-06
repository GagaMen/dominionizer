import { Injectable } from '@angular/core';
import * as math from 'mathjs';
import { Card } from '../models/card';

@Injectable({
    providedIn: 'root',
})
export class MathJsService {
    pickRandomCards(cards: Card[], number?: number, weights?: number[]): Card[] {
        const cardIds = cards.map((card: Card) => card.id);
        const pickedCardIds = weights
            ? math.pickRandom(cardIds, number, weights)
            : math.pickRandom(cardIds, number);

        return typeof pickedCardIds === 'number'
            ? [cards.find((card: Card) => card.id === pickedCardIds) as Card]
            : (pickedCardIds.map((cardId: number) =>
                  cards.find((card: Card) => card.id === cardId),
              ) as Card[]);
    }
}
