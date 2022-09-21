import { map } from 'rxjs/operators';
import { Card } from './../models/card';
import { Set } from './../models/set';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';

export type GroupingOption = 'without' | 'byExpansion';
export type SortingOption = 'byName' | 'byCost';

@Injectable({
    providedIn: 'root',
})
export class SetService {
    static readonly defaultSet: Set = {
        kingdomCards: [],
        specialCards: [],
    };
    static readonly defaultGroupingOption: GroupingOption = 'without';
    static readonly defaultSortingOption: SortingOption = 'byName';

    private setSubject = new BehaviorSubject<Set>(SetService.defaultSet);
    private groupingOptionSubject = new BehaviorSubject<GroupingOption>(
        SetService.defaultGroupingOption,
    );
    private sortingOptionSubject = new BehaviorSubject<SortingOption>(
        SetService.defaultSortingOption,
    );

    readonly set$: Observable<Set> = combineLatest([
        this.setSubject,
        this.groupingOptionSubject,
        this.sortingOptionSubject,
    ]).pipe(
        map(([set, groupingOption, sortingOption]: [Set, GroupingOption, SortingOption]) => {
            set.kingdomCards.sort((firstCard: Card, secondCard: Card) =>
                SetService.orderCards(firstCard, secondCard, groupingOption, sortingOption),
            );
            set.specialCards.sort((firstCard: Card, secondCard: Card) =>
                SetService.orderCards(firstCard, secondCard, groupingOption, sortingOption),
            );

            return set;
        }),
    );
    readonly groupingOption$: Observable<GroupingOption> =
        this.groupingOptionSubject.asObservable();
    readonly sortingOption$: Observable<SortingOption> = this.sortingOptionSubject.asObservable();

    static orderCards(
        firstCard: Card,
        secondCard: Card,
        groupingOption: GroupingOption,
        sortingOption: SortingOption,
    ): number {
        if (groupingOption === 'byExpansion') {
            const expansionComparison = firstCard.expansions[0].name.localeCompare(
                secondCard.expansions[0].name,
            );
            if (expansionComparison !== 0) return expansionComparison;
        }

        switch (sortingOption) {
            case 'byCost': {
                const costComparison = firstCard.cost - secondCard.cost;
                if (costComparison !== 0) return costComparison;
            }
            // falls through
            case 'byName':
                return firstCard.name.localeCompare(secondCard.name);
        }
    }

    updateSet(set: Set): void {
        this.setSubject.next(set);
    }

    updateGroupingOption(groupingOption: GroupingOption): void {
        this.groupingOptionSubject.next(groupingOption);
    }

    updateSortingOption(sortingOption: SortingOption): void {
        this.sortingOptionSubject.next(sortingOption);
    }
}
