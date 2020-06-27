import { Card } from './../models/card';
import { Set, SetPartName } from './../models/set';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SetService {
    static readonly defaultSet: Set = {
        cards: [],
        events: [],
        landmarks: [],
        projects: [],
        ways: [],
    };

    private setSubject = new BehaviorSubject<Set>(SetService.defaultSet);

    readonly set$: Observable<Set> = this.setSubject.asObservable();

    updateSet(set: Set): void {
        this.setSubject.next(set);
    }

    updateSingleCard(oldCard: Card, newCard: Card, setPartName: SetPartName): void {
        const set = this.setSubject.value;
        const setPart: Card[] = set[setPartName];
        const cardIndex = setPart.indexOf(oldCard);
        setPart[cardIndex] = newCard;

        this.setSubject.next(set);
    }
}
