import { EditionTranslation } from './../models/edition';
import { Injectable, inject } from '@angular/core';
import { Edition } from '../models/edition';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root',
})
export class EditionService {
    private dataService = inject(DataService);

    readonly editions: Edition[] = this.translate(
        this.dataService.getEditions(),
        this.dataService.getEditionTranslations(),
    );

    private translate(editions: Edition[], translations: EditionTranslation[]): Edition[] {
        return editions.map((edition: Edition) => {
            const translation = translations.find(
                (translation: EditionTranslation) => translation.id === edition.id,
            );

            return translation === undefined
                ? edition
                : { ...edition, expansion: translation.expansion };
        });
    }
}
