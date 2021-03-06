import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expansion } from '../models/expansion';
import { CardDto } from '../dtos/card-dto';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    static expansionsUrl = `${environment.entryPoint}/assets/data/expansions.json`;
    static cardsUrl = `${environment.entryPoint}/assets/data/cards.json`;

    constructor(private http: HttpClient) {}

    fetchExpansions(): Observable<Expansion[]> {
        return this.http.get<Expansion[]>(DataService.expansionsUrl);
    }

    fetchCards(): Observable<CardDto[]> {
        return this.http.get<CardDto[]>(DataService.cardsUrl);
    }
}
