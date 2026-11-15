import { CardTypeTranslation } from './../models/card-type';
import { EditionTranslation } from './../models/edition';
import { Injectable } from '@angular/core';
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
    getEditions(): Edition[] {
        return editions;
    }

    getEditionTranslations(): EditionTranslation[] {
        return editionTranslations;
    }

    getCardTypes(): CardType[] {
        return cardTypes;
    }

    getCardTypeTranslations(): CardTypeTranslation[] {
        return cardTypeTranslations;
    }

    getCards(): CardDto[] {
        return cards;
    }

    getCardTranslations(): CardTranslation[] {
        return cardTranslations;
    }
}
