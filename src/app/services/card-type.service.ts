import { CardTypeTranslation } from './../models/card-type';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { CardType } from '../models/card-type';
import { DataService } from './data.service';
import { TranslationService } from './translation.service';

@Injectable({
    providedIn: 'root',
})
export class CardTypeService {
    private cardTypesSubject: BehaviorSubject<CardType[]> = new BehaviorSubject<CardType[]>([]);

    readonly cardTypes$: Observable<CardType[]> = this.cardTypesSubject.pipe(
        first((cardTypes: CardType[]) => cardTypes.length !== 0),
    );

    constructor(
        private dataService: DataService,
        private translationService: TranslationService,
    ) {
        combineLatest([
            this.dataService.fetchCardTypes(),
            this.translationService.getCardTypeTranslations(),
        ])
            .pipe(
                map(([cardTypes, translations]) => {
                    cardTypes.forEach((cardType: CardType) => {
                        const translation = translations.find(
                            (translation: CardTypeTranslation) => translation.id === cardType.id,
                        );
                        if (translation === undefined) {
                            return;
                        }

                        cardType.name = translation.name;
                    });

                    return cardTypes;
                }),
            )
            .subscribe((cardTypes: CardType[]) => this.cardTypesSubject.next(cardTypes));
    }
}
