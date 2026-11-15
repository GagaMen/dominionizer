import { CardTypeTranslation } from './../models/card-type';
import { Injectable, inject } from '@angular/core';
import { CardType } from '../models/card-type';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root',
})
export class CardTypeService {
    private dataService = inject(DataService);

    readonly cardTypes: CardType[] = this.translate(
        this.dataService.getCardTypes(),
        this.dataService.getCardTypeTranslations(),
    );

    private translate(cardTypes: CardType[], translations: CardTypeTranslation[]): CardType[] {
        return cardTypes.map((cardType: CardType) => {
            const translation = translations.find(
                (translation: CardTypeTranslation) => translation.id === cardType.id,
            );

            return translation === undefined ? cardType : { ...cardType, name: translation.name };
        });
    }
}
