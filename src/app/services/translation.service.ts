import { CardTypeTranslation } from './../models/card-type';
import { ExpansionTranslation } from './../models/expansion';
import { Observable, of } from 'rxjs';
import { DataService } from './data.service';
import { CardTranslation } from './../models/card';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    private localeTranslationFileSuffixMap = new Map<string, string>([
        ['zh', 'chinese'],
        ['cs', 'czech'],
        ['nl', 'dutch'],
        ['fi', 'finnish'],
        ['fr', 'french'],
        ['de', 'german'],
        ['el', 'greek'],
        ['hu', 'hungarian'],
        ['it', 'italian'],
        ['ja', 'japanese'],
        ['ko', 'korean'],
        ['no', 'norwegian'],
        ['pl', 'polish'],
        ['ro', 'romanian'],
        ['ru', 'russian'],
        ['es', 'spanish'],
    ]);

    constructor(@Inject(LOCALE_ID) private locale: string, private dataService: DataService) {}

    getExpansionTranslations(): Observable<ExpansionTranslation[]> {
        return this.getTranslations<ExpansionTranslation>(
            (fileName: string) => this.dataService.fetchExpansionTranslations(fileName),
            'expansions',
        );
    }

    getCardTypeTranslations(): Observable<CardTypeTranslation[]> {
        return this.getTranslations<CardTypeTranslation>(
            (fileName: string) => this.dataService.fetchCardTypeTranslations(fileName),
            'card-types',
        );
    }

    getCardTranslations(): Observable<CardTranslation[]> {
        return this.getTranslations<CardTranslation>(
            (fileName: string) => this.dataService.fetchCardTranslations(fileName),
            'cards',
        );
    }

    private getTranslations<T>(
        get: (fileName: string) => Observable<T[]>,
        fileNamePrefix: string,
    ): Observable<T[]> {
        const translationFileSuffix = this.localeTranslationFileSuffixMap.get(this.locale);
        if (translationFileSuffix === undefined) {
            return of([]);
        }

        return get(`${fileNamePrefix}.${translationFileSuffix}.json`);
    }
}
