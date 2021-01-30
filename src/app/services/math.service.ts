import { Injectable } from '@angular/core';
import { Card } from '../models/card';

@Injectable({
    providedIn: 'root',
})
export class MathService {
    pickRandomCards(candidates: Card[], amount: number): Card[] {
        if (amount > candidates.length) {
            throw new Error(
                `Amount has to be equal or less than candidates size, but was greater. ` +
                    `(Amount: ${amount}; Candidates: ${candidates.length})`,
            );
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
