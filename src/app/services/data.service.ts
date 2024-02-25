import { CardTypeTranslation } from './../models/card-type';
import { ExpansionTranslation } from './../models/expansion';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Expansion } from '../models/expansion';
import { CardDto } from '../dtos/card-dto';
import { CardType } from '../models/card-type';
import { CardTranslation } from '../models/card';
import expansions from '../../assets/data/expansions.json';
import cardTypes from '../../assets/data/card-types.json';
import cards from '../../assets/data/cards.json';
import {
    cardTranslations,
    cardTypeTranslations,
    expansionTranslations,
} from 'src/assets/data/translations';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    fetchExpansions(): Observable<Expansion[]> {
        return of(expansions as Expansion[]);
    }

    fetchExpansionTranslations(): Observable<ExpansionTranslation[]> {
        return of(expansionTranslations);
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
