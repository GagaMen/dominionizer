import { CardTypeTranslation } from './../models/card-type';
import { ExpansionTranslation } from './../models/expansion';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expansion } from '../models/expansion';
import { CardDto } from '../dtos/card-dto';
import { CardType } from '../models/card-type';
import { CardTranslation } from '../models/card';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    static dataPath = `${environment.entryPoint}/assets/data`;
    static expansionsUrl = `${environment.entryPoint}/assets/data/expansions.json`;
    static cardTypesUrl = `${environment.entryPoint}/assets/data/card-types.json`;
    static cardsUrl = `${environment.entryPoint}/assets/data/cards.json`;

    constructor(private http: HttpClient) {}

    fetchExpansions(): Observable<Expansion[]> {
        return this.http.get<Expansion[]>(DataService.expansionsUrl);
    }

    fetchExpansionTranslations(translationFileName: string): Observable<ExpansionTranslation[]> {
        return this.http.get<ExpansionTranslation[]>(
            `${DataService.dataPath}/${translationFileName}`,
        );
    }

    fetchCardTypes(): Observable<CardType[]> {
        return this.http.get<CardType[]>(DataService.cardTypesUrl);
    }

    fetchCardTypeTranslations(translationFileName: string): Observable<CardTypeTranslation[]> {
        return this.http.get<CardTypeTranslation[]>(
            `${DataService.dataPath}/${translationFileName}`,
        );
    }

    fetchCards(): Observable<CardDto[]> {
        return this.http.get<CardDto[]>(DataService.cardsUrl);
    }

    fetchCardTranslations(translationFileName: string): Observable<CardTranslation[]> {
        return this.http.get<CardTranslation[]>(`${DataService.dataPath}/${translationFileName}`);
    }
}
