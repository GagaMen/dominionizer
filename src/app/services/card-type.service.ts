import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { CardType } from '../models/card-type';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root',
})
export class CardTypeService {
    private cardTypesSubject: BehaviorSubject<CardType[]> = new BehaviorSubject<CardType[]>([]);

    readonly cardTypes$: Observable<CardType[]> = this.cardTypesSubject.pipe(
        first((cardTypes: CardType[]) => cardTypes.length !== 0),
    );

    constructor(private dataService: DataService) {
        this.dataService
            .fetchCardTypes()
            .subscribe((cardTypes: CardType[]) => this.cardTypesSubject.next(cardTypes));
    }
}
