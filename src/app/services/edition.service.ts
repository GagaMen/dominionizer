import { EditionTranslation } from './../models/edition';
import { Injectable, inject } from '@angular/core';
import { Edition } from '../models/edition';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { DataService } from './data.service';
import { first, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class EditionService {
    private dataService = inject(DataService);

    private editionsSubject: BehaviorSubject<Edition[]> = new BehaviorSubject<Edition[]>([]);

    readonly editions$: Observable<Edition[]> = this.editionsSubject.pipe(
        first((editions: Edition[]) => editions.length !== 0),
    );

    constructor() {
        combineLatest([
            this.dataService.fetchEditions(),
            this.dataService.fetchEditionTranslations(),
        ])
            .pipe(
                map(([editions, translations]) => {
                    editions.forEach((edition: Edition) => {
                        const translation = translations.find(
                            (translation: EditionTranslation) => translation.id === edition.id,
                        );
                        if (translation === undefined) {
                            return;
                        }

                        edition.expansion = translation.expansion;
                    });

                    return editions;
                }),
            )
            .subscribe((editions: Edition[]) => {
                this.editionsSubject.next(editions);
            });
    }
}
