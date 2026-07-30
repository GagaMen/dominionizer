import { CardTypeTranslation } from './../models/card-type';
import { EditionTranslation } from './../models/edition';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Edition } from '../models/edition';
import { CardDto } from '../dtos/card-dto';
import { CardType } from '../models/card-type';
import { CardTranslation } from '../models/card';
import editions from '../../data/editions.json';
import cardTypes from '../../data/card-types.json';
import cards from '../../data/cards.json';
import { cardTranslations, cardTypeTranslations, editionTranslations } from 'src/data/translations';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    fetchEditions(): Observable<Edition[]> {
        return of(editions as Edition[]);
    }

    fetchEditionTranslations(): Observable<EditionTranslation[]> {
        return of(editionTranslations);
    }

    fetchCardTypes(): Observable<CardType[]> {
        return of(cardTypes as CardType[]);
    }

    fetchCardTypeTranslations(): Observable<CardTypeTranslation[]> {
        return of(cardTypeTranslations);
    }

    fetchCards(): Observable<CardDto[]> {
        return of(cards as CardDto[]);
    }

    fetchCardTranslations(): Observable<CardTranslation[]> {
        return of(cardTranslations);
    }
}
