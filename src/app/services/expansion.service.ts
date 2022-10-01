import { ExpansionTranslation } from './../models/expansion';
import { TranslationService } from './translation.service';
import { Injectable } from '@angular/core';
import { Expansion } from '../models/expansion';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { DataService } from './data.service';
import { first, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ExpansionService {
    private expansionsSubject: BehaviorSubject<Expansion[]> = new BehaviorSubject<Expansion[]>([]);

    readonly expansions$: Observable<Expansion[]> = this.expansionsSubject.pipe(
        first((expansions: Expansion[]) => expansions.length !== 0),
    );

    constructor(private dataService: DataService, private translationService: TranslationService) {
        combineLatest([
            this.dataService.fetchExpansions(),
            this.translationService.getExpansionTranslations(),
        ])
            .pipe(
                map(([expansions, translations]) => {
                    expansions.forEach((expansion: Expansion) => {
                        const translation = translations.find(
                            (translation: ExpansionTranslation) =>
                                translation.id === expansion.id ||
                                translation.id === expansion.id - 0.1,
                        );
                        if (translation === undefined) {
                            return;
                        }

                        expansion.name = expansion.name
                            .replace(/^[^(]*/, `${translation.name} `)
                            .trim();
                    });

                    return expansions;
                }),
            )
            .subscribe((expansions: Expansion[]) => {
                this.expansionsSubject.next(expansions);
            });
    }
}
