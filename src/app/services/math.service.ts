import { Injectable } from '@angular/core';
import { Card } from '../models/card';

@Injectable({
    providedIn: 'root',
})
export class MathService {
    pickRandomCards(candidates: Card[], amount: number): Card[] {
        if (amount >= candidates.length) {
            return [...candidates];
        }

        const result = [];
        const currentCandidates = [...candidates];
        for (let i = 0; i < amount; i++) {
            const index = Math.floor(Math.random() * currentCandidates.length);
            const pickedCard = currentCandidates.splice(index, 1)[0];
            result.push(pickedCard);
        }

        return result;
    }
}
