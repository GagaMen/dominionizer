import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { cold } from 'jasmine-marbles';
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

    describe('fetchEditions', () => {
        it('should return all editions', () => {
            const expected$ = cold('(a|)', { a: editions });

            const actual$ = dataService.fetchEditions();

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('fetchEditionTranslations', () => {
        it('should return all edition translations', () => {
            const expected$ = cold('(a|)', { a: editionTranslations });

            const actual$ = dataService.fetchEditionTranslations();

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('fetchCardTypes', () => {
        it('should return all card types', () => {
            const expected$ = cold('(a|)', { a: cardTypes });

            const actual$ = dataService.fetchCardTypes();

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('fetchCardTypeTranslations', () => {
        it('should return all card type translations', () => {
            const expected$ = cold('(a|)', { a: cardTypeTranslations });

            const actual$ = dataService.fetchCardTypeTranslations();

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('fetchCards', () => {
        it('should return all cards', () => {
            const expected$ = cold('(a|)', { a: cards });

            const actual$ = dataService.fetchCards();

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('fetchCardTranslations', () => {
        it('should return all card translations', () => {
            const expected$ = cold('(a|)', { a: cardTranslations });

            const actual$ = dataService.fetchCardTranslations();

            expect(actual$).toBeObservable(expected$);
        });
    });
});
