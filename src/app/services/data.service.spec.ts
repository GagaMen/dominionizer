import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { cold } from 'jasmine-marbles';
import expansions from '../../data/expansions.json';
import cardTypes from '../../data/card-types.json';
import cards from '../../data/cards.json';
import {
    cardTranslations,
    cardTypeTranslations,
    expansionTranslations,
} from 'src/data/translations';

describe('DataService', () => {
    let dataService: DataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        dataService = TestBed.inject(DataService);
    });

    describe('fetchExpansions', () => {
        it('should return all expansions', () => {
            const expected$ = cold('(a|)', { a: expansions });

            const actual$ = dataService.fetchExpansions();

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('fetchExpansionTranslations', () => {
        it('should return all expansion translations', () => {
            const expected$ = cold('(a|)', { a: expansionTranslations });

            const actual$ = dataService.fetchExpansionTranslations();

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
