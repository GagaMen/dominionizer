import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { DataFixture } from 'src/testing/data-fixture';
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

        it('with grouping option "without" and sorting option "byName" should emit set with kingdom cards correctly ordered', () => {
            const firstCard = dataFixture.createCard({ name: 'a' });
            const secondCard = dataFixture.createCard({ name: 'b' });
            const unorderedSet = dataFixture.createSet({
                kingdomCards: [secondCard, firstCard],
                specialCards: [],
            });
            setService.updateGroupingOption('without');
            setService.updateSortingOption('byName');
            setService.updateSet(unorderedSet);
            const expectedSet: Set = {
                ...unorderedSet,
                kingdomCards: [firstCard, secondCard],
            };
            const expected$: Observable<Set> = cold('a', { a: expectedSet });

            const actual$ = setService.set$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with grouping option "without" and sorting option "byCost" should emit set with kingdom cards correctly ordered', () => {
            const firstCard = dataFixture.createCard({ cost: 1 });
            const secondCard = dataFixture.createCard({ cost: 2, name: 'a' });
            const thirdCard = dataFixture.createCard({ cost: 2, name: 'b' });
            const unorderedSet = dataFixture.createSet({
                kingdomCards: [thirdCard, secondCard, firstCard],
                specialCards: [],
            });
            setService.updateGroupingOption('without');
            setService.updateSortingOption('byCost');
            setService.updateSet(unorderedSet);
            const expectedSet: Set = {
                ...unorderedSet,
                kingdomCards: [firstCard, secondCard, thirdCard],
            };
            const expected$: Observable<Set> = cold('a', { a: expectedSet });

            const actual$ = setService.set$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with grouping option "byExpansion" and sorting option "byName" should emit set with kingdom cards correctly ordered', () => {
            const firstExpansion = dataFixture.createExpansion({ name: 'a' });
            const secondExpansion = dataFixture.createExpansion({ name: 'b' });
            const firstCard = dataFixture.createCard({ expansions: [firstExpansion] });
            const secondCard = dataFixture.createCard({ expansions: [secondExpansion], name: 'a' });
            const thirdCard = dataFixture.createCard({ expansions: [secondExpansion], name: 'b' });
            const unorderedSet = dataFixture.createSet({
                kingdomCards: [thirdCard, secondCard, firstCard],
                specialCards: [],
            });
            setService.updateGroupingOption('byExpansion');
            setService.updateSortingOption('byName');
            setService.updateSet(unorderedSet);
            const expectedSet: Set = {
                ...unorderedSet,
                kingdomCards: [firstCard, secondCard, thirdCard],
            };
            const expected$: Observable<Set> = cold('a', { a: expectedSet });

            const actual$ = setService.set$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with grouping option "byExpansion" and sorting option "byCost" should emit set with kingdom cards correctly ordered', () => {
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
            const unorderedSet = dataFixture.createSet({
                kingdomCards: [fourthCard, thirdCard, secondCard, firstCard],
                specialCards: [],
            });
            setService.updateGroupingOption('byExpansion');
            setService.updateSortingOption('byCost');
            setService.updateSet(unorderedSet);
            const expectedSet: Set = {
                ...unorderedSet,
                kingdomCards: [firstCard, secondCard, thirdCard, fourthCard],
            };
            const expected$: Observable<Set> = cold('a', { a: expectedSet });

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

    describe('updateSet', () => {
        it('should update set', () => {
            const set = dataFixture.createSet({
                kingdomCards: dataFixture.createCards(1),
                specialCards: [],
            });
            const expected$: Observable<Set> = cold('a', { a: set });

            setService.updateSet(set);
            const actual$ = setService.set$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('updateSingleCard', () => {
        it('should update set correctly', () => {
            const initialSet = dataFixture.createSet({
                kingdomCards: dataFixture.createCards(1),
                specialCards: [],
            });
            setService.updateSet(initialSet);
            const oldCard = initialSet.kingdomCards[0];
            const newCard = dataFixture.createCard();
            const expectedSet: Set = {
                ...initialSet,
                kingdomCards: [newCard],
            };
            const expected$: Observable<Set> = cold('a', { a: expectedSet });

            setService.updateSingleCard(oldCard, newCard, 'kingdomCards');
            const actual$ = setService.set$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('updateGroupingOption', () => {
        it('should update grouping option', () => {
            const groupingOption: GroupingOption = 'byExpansion';
            const expected$: Observable<GroupingOption> = cold('a', { a: groupingOption });

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
            const expected$: Observable<SortingOption> = cold('a', { a: sortingOption });

            setService.updateSortingOption(sortingOption);
            const actual$ = setService.sortingOption$;

            expect(sortingOption)
                .withContext('test value')
                .not.toBe(SetService.defaultSortingOption);
            expect(actual$).toBeObservable(expected$);
        });
    });
});
