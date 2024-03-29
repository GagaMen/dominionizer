import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { DataFixture } from 'src/testing/data-fixture';
import { Card } from '../models/card';
import { Set } from '../models/set';

import { GroupingOption, SetService, SortingOption } from './set.service';

describe('SetService', () => {
    let setService: SetService;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        dataFixture = new DataFixture();
        setService = TestBed.inject(SetService);
    });

    describe('set$', () => {
        it('with service just initialized should emit default set', () => {
            const expected$ = cold('a', { a: SetService.defaultSet });

            const actual$ = setService.set$;

            expect(actual$).toBeObservable(expected$);
        });

        it('should emit set with correctly ordered kingdom cards', () => {
            const set = dataFixture.createSet({ specialCards: [] });
            const groupingOption = dataFixture.createGroupingOption();
            const sortingOption = dataFixture.createSortingOption();
            setService.updateSet(set);
            setService.updateGroupingOption(groupingOption);
            setService.updateSortingOption(sortingOption);
            const expectedSet: Set = {
                ...set,
                kingdomCards: [...set.kingdomCards].sort((a: Card, b: Card) =>
                    SetService.orderCards(a, b, groupingOption, sortingOption),
                ),
            };
            const expected$ = cold('a', { a: expectedSet });

            const actual$ = setService.set$;

            expect(actual$).toBeObservable(expected$);
        });

        it('should emit set with correctly ordered special cards', () => {
            const set = dataFixture.createSet({
                kingdomCards: [],
                specialCards: dataFixture.createCards(10),
            });
            const groupingOption = dataFixture.createGroupingOption();
            const sortingOption = dataFixture.createSortingOption();
            setService.updateSet(set);
            setService.updateGroupingOption(groupingOption);
            setService.updateSortingOption(sortingOption);
            const expectedSet: Set = {
                ...set,
                specialCards: [...set.specialCards].sort((a: Card, b: Card) =>
                    SetService.orderCards(a, b, groupingOption, sortingOption),
                ),
            };
            const expected$ = cold('a', { a: expectedSet });

            const actual$ = setService.set$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('groupingOption$', () => {
        it('with service just initialized should emit default grouping option', () => {
            const expected$ = cold('a', { a: SetService.defaultGroupingOption });

            const actual$ = setService.groupingOption$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('sortingOption$', () => {
        it('with service just initialized should emit default sorting option', () => {
            const expected$ = cold('a', { a: SetService.defaultSortingOption });

            const actual$ = setService.sortingOption$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('orderCards', () => {
        it('with grouping option "without" and sorting option "byName" should order cards correctly', () => {
            const firstCard = dataFixture.createCard({ name: 'a' });
            const secondCard = dataFixture.createCard({ name: 'b' });
            const unorderedCards = [secondCard, firstCard];
            const expected = [firstCard, secondCard];

            const actual = [...unorderedCards].sort((a: Card, b: Card) =>
                SetService.orderCards(a, b, 'without', 'byName'),
            );

            expect(actual).toEqual(expected);
        });

        it('with grouping option "without" and sorting option "byCost" should order cards correctly', () => {
            const firstCard = dataFixture.createCard({ cost: 1 });
            const secondCard = dataFixture.createCard({ cost: 2, name: 'a' });
            const thirdCard = dataFixture.createCard({ cost: 2, name: 'b' });
            const unorderedCards = [thirdCard, secondCard, firstCard];
            const expected = [firstCard, secondCard, thirdCard];

            const actual = [...unorderedCards].sort((a: Card, b: Card) =>
                SetService.orderCards(a, b, 'without', 'byCost'),
            );

            expect(actual).toEqual(expected);
        });

        it('with grouping option "byExpansion" and sorting option "byName" should order cards correctly', () => {
            const firstExpansion = dataFixture.createExpansion({ name: 'a' });
            const secondExpansion = dataFixture.createExpansion({ name: 'b' });
            const firstCard = dataFixture.createCard({ expansions: [firstExpansion] });
            const secondCard = dataFixture.createCard({ expansions: [secondExpansion], name: 'a' });
            const thirdCard = dataFixture.createCard({ expansions: [secondExpansion], name: 'b' });
            const unorderedCards = [thirdCard, secondCard, firstCard];
            const expected = [firstCard, secondCard, thirdCard];

            const actual = [...unorderedCards].sort((a: Card, b: Card) =>
                SetService.orderCards(a, b, 'byExpansion', 'byName'),
            );

            expect(actual).toEqual(expected);
        });

        it('with grouping option "byExpansion" and sorting option "byCost" should order cards correctly', () => {
            const firstExpansion = dataFixture.createExpansion({ name: 'a' });
            const secondExpansion = dataFixture.createExpansion({ name: 'b' });
            const firstCard = dataFixture.createCard({ expansions: [firstExpansion] });
            const secondCard = dataFixture.createCard({ expansions: [secondExpansion], cost: 1 });
            const thirdCard = dataFixture.createCard({
                expansions: [secondExpansion],
                cost: 2,
                name: 'a',
            });
            const fourthCard = dataFixture.createCard({
                expansions: [secondExpansion],
                cost: 2,
                name: 'b',
            });
            const unorderedCards = [fourthCard, thirdCard, secondCard, firstCard];
            const expected = [firstCard, secondCard, thirdCard, fourthCard];

            const actual = [...unorderedCards].sort((a: Card, b: Card) =>
                SetService.orderCards(a, b, 'byExpansion', 'byCost'),
            );

            expect(actual).toEqual(expected);
        });
    });

    describe('updateSet', () => {
        it('should update set', () => {
            const set = dataFixture.createSet({
                kingdomCards: dataFixture.createCards(1),
                specialCards: [],
            });
            const expected$ = cold('a', { a: set });

            setService.updateSet(set);
            const actual$ = setService.set$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('updateGroupingOption', () => {
        it('should update grouping option', () => {
            const groupingOption: GroupingOption = 'byExpansion';
            const expected$ = cold('a', { a: groupingOption });

            setService.updateGroupingOption(groupingOption);
            const actual$ = setService.groupingOption$;

            expect(groupingOption)
                .withContext('test value')
                .not.toBe(SetService.defaultGroupingOption);
            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('updateSortingOption', () => {
        it('should update sorting option', () => {
            const sortingOption: SortingOption = 'byCost';
            const expected$ = cold('a', { a: sortingOption });

            setService.updateSortingOption(sortingOption);
            const actual$ = setService.sortingOption$;

            expect(sortingOption)
                .withContext('test value')
                .not.toBe(SetService.defaultSortingOption);
            expect(actual$).toBeObservable(expected$);
        });
    });
});
