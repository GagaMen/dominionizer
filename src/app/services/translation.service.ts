import { Language } from './../models/language';
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
        [Language.Chinese, 'chinese'],
        [Language.Czech, 'czech'],
        [Language.Dutch, 'dutch'],
        [Language.Finnish, 'finnish'],
        [Language.French, 'french'],
        [Language.German, 'german'],
        [Language.Greek, 'greek'],
        [Language.Hungarian, 'hungarian'],
        [Language.Italian, 'italian'],
        [Language.Japanese, 'japanese'],
        [Language.Korean, 'korean'],
        [Language.Norwegian, 'norwegian'],
        [Language.Polish, 'polish'],
        [Language.Romanian, 'romanian'],
        [Language.Russian, 'russian'],
        [Language.Spanish, 'spanish'],
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
