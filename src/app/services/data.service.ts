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
    public dataPath = `${environment.entryPoint}/assets/data`;
    public expansionsUrl = `${this.dataPath}/expansions.json`;
    public cardTypesUrl = `${this.dataPath}/card-types.json`;
    public cardsUrl = `${this.dataPath}/cards.json`;

    constructor(private http: HttpClient) {}

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
