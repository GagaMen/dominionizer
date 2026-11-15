import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import editions from '../../data/editions.json';
import cardTypes from '../../data/card-types.json';
import cards from '../../data/cards.json';
import { cardTranslations, cardTypeTranslations, editionTranslations } from 'src/data/translations';

describe('DataService', () => {
    let dataService: DataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        dataService = TestBed.inject(DataService);
    });

    describe('getEditions', () => {
        it('should return all editions', () => {
            const expected = editions;

            const actual = dataService.getEditions();

            expect(actual).toEqual(expected);
        });
    });

    describe('getEditionTranslations', () => {
        it('should return all edition translations', () => {
            const expected = editionTranslations;

            const actual = dataService.getEditionTranslations();

            expect(actual).toEqual(expected);
        });
    });

    describe('getCardTypes', () => {
        it('should return all card types', () => {
            const expected = cardTypes;

            const actual = dataService.getCardTypes();

            expect(actual).toEqual(expected);
        });
    });

    describe('getCardTypeTranslations', () => {
        it('should return all card type translations', () => {
            const expected = cardTypeTranslations;

            const actual = dataService.getCardTypeTranslations();

            expect(actual).toEqual(expected);
        });
    });

    describe('getCards', () => {
        it('should return all cards', () => {
            const expected = cards;

            const actual = dataService.getCards();

            expect(actual).toEqual(expected);
        });
    });

    describe('getCardTranslations', () => {
        it('should return all card translations', () => {
            const expected = cardTranslations;

            const actual = dataService.getCardTranslations();

            expect(actual).toEqual(expected);
        });
    });
});
