import { AppBarService } from './../../services/app-bar.service';
import { Card } from './../../models/card';
import { SortOptions } from './../../models/sort-options';
import { Observable, combineLatest } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ShuffleService } from '../../services/shuffle.service';
import { SetService } from 'src/app/services/set.service';

@Component({
    selector: 'app-generate-set-result',
    templateUrl: './generate-set-result.component.html',
    styleUrls: ['./generate-set-result.component.scss'],
})
export class GenerateSetResultComponent implements OnInit {
    formGroup: FormGroup = new FormGroup({});
    sortOptions$: Observable<FormGroup>;

    constructor(
        private shuffleService: ShuffleService,
        public setService: SetService,
        private formBuilder: FormBuilder,
        private appBarService: AppBarService,
    ) {
        this.buildFormGroup();
        this.sortOptions$ = this.formGroup.valueChanges;
        this.initializeSorting();
        this.shuffle();
    }

    ngOnInit(): void {
        this.appBarService.updateConfiguration({ navigationAction: 'back', actions: [] });
    }

    private buildFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            expansion: new FormControl(false),
            sorting: new FormControl('1'),
        });
    }

    private initializeSorting(): void {
        combineLatest(this.setService.set$, this.sortOptions$).subscribe(([set, sortOptions]) => {
            set.cards.sort((firstCard: Card, secondCard: Card) => {
                const options = (sortOptions as unknown) as SortOptions;
                return (
                    this.sortByExpansion(firstCard, secondCard, options) ||
                    this.sortByProperty(firstCard, secondCard, options)
                );
            });
        });
    }

    private sortByExpansion(firstCard: Card, secondCard: Card, options: SortOptions): number {
        if (!options.expansion) {
            return 0;
        }

        return firstCard.expansions[0].name.localeCompare(secondCard.expansions[0].name);
    }

    private sortByProperty(firstCard: Card, secondCard: Card, options: SortOptions): number {
        if (options.sorting === '1') {
            return firstCard.name.localeCompare(secondCard.name);
        }

        // TODO: repsect cards with debt costs
        return firstCard.cost - secondCard.cost;
    }

    shuffle(): void {
        this.shuffleService.shuffleCards();
    }
}
