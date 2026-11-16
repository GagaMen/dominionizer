import { Card } from './../models/card';
import { Set } from './../models/set';
import { Injectable, computed, signal } from '@angular/core';

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

    private readonly unorderedSet = signal<Set>(SetService.defaultSet);
    private readonly groupingOptionState = signal<GroupingOption>(SetService.defaultGroupingOption);
    private readonly sortingOptionState = signal<SortingOption>(SetService.defaultSortingOption);

    readonly groupingOption = this.groupingOptionState.asReadonly();
    readonly sortingOption = this.sortingOptionState.asReadonly();
    readonly set = computed<Set>(() => {
        const set = this.unorderedSet();
        const groupingOption = this.groupingOption();
        const sortingOption = this.sortingOption();
        const orderCards = (firstCard: Card, secondCard: Card) =>
            SetService.orderCards(firstCard, secondCard, groupingOption, sortingOption);

        // order copies, a signal does not notify about changes inside of its value
        return {
            kingdomCards: [...set.kingdomCards].sort(orderCards),
            specialCards: [...set.specialCards].sort(orderCards),
        };
    });

    static orderCards(
        firstCard: Card,
        secondCard: Card,
        groupingOption: GroupingOption,
        sortingOption: SortingOption,
    ): number {
        if (groupingOption === 'byExpansion') {
            const expansionComparison = (firstCard.editions[0]?.expansion ?? '').localeCompare(
                secondCard.editions[0]?.expansion ?? '',
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
        this.unorderedSet.set(set);
    }

    updateGroupingOption(groupingOption: GroupingOption): void {
        this.groupingOptionState.set(groupingOption);
    }

    updateSortingOption(sortingOption: SortingOption): void {
        this.sortingOptionState.set(sortingOption);
    }
}
