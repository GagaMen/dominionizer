import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expansion } from '../models/expansion';
import { CardDto } from '../dtos/card-dto';
import { CardType } from '../models/card-type';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    static expansionsUrl = `${environment.entryPoint}/assets/data/expansions.json`;
    static cardTypesUrl = `${environment.entryPoint}/assets/data/card-types.json`;
    static cardsUrl = `${environment.entryPoint}/assets/data/cards.json`;

    constructor(private http: HttpClient) {}

    fetchExpansions(): Observable<Expansion[]> {
        return this.http.get<Expansion[]>(DataService.expansionsUrl);
    }

    fetchCardTypes(): Observable<CardType[]> {
        return this.http.get<CardType[]>(DataService.cardTypesUrl);
    }

    fetchCards(): Observable<CardDto[]> {
        return this.http.get<CardDto[]>(DataService.cardsUrl);
    }
}
