import { CardTypeTranslation } from './../models/card-type';
import { ExpansionTranslation } from './../models/expansion';
import { environment } from './../../environments/environment';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
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
    public dataPath = `${environment.entryPoint}/${this.locale}/assets/data`;
    public expansionsUrl = `${environment.entryPoint}/${this.locale}/assets/data/expansions.json`;
    public cardTypesUrl = `${environment.entryPoint}/${this.locale}/assets/data/card-types.json`;
    public cardsUrl = `${environment.entryPoint}/${this.locale}/assets/data/cards.json`;

    constructor(private http: HttpClient, @Inject(LOCALE_ID) private locale: string) {}

    fetchExpansions(): Observable<Expansion[]> {
        return this.http.get<Expansion[]>(this.expansionsUrl);
    }

    fetchExpansionTranslations(translationFileName: string): Observable<ExpansionTranslation[]> {
        return this.http.get<ExpansionTranslation[]>(`${this.dataPath}/${translationFileName}`);
    }

    fetchCardTypes(): Observable<CardType[]> {
        return this.http.get<CardType[]>(this.cardTypesUrl);
    }

    fetchCardTypeTranslations(translationFileName: string): Observable<CardTypeTranslation[]> {
        return this.http.get<CardTypeTranslation[]>(`${this.dataPath}/${translationFileName}`);
    }

    fetchCards(): Observable<CardDto[]> {
        return this.http.get<CardDto[]>(this.cardsUrl);
    }

    fetchCardTranslations(translationFileName: string): Observable<CardTranslation[]> {
        return this.http.get<CardTranslation[]>(`${this.dataPath}/${translationFileName}`);
    }
}
