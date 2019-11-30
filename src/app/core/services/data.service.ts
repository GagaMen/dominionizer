import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expansion } from '../models/expansion';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  expansions(): Observable<Expansion[]> {
    return this.http.get<Expansion[]>('/assets/data/expansions.json');
  }

  cards(): Observable<Card[]> {
    return this.http.get<Card[]>('/assets/data/cards.json');
  }

  events(): Observable<Card[]> {
    return this.http.get<Card[]>('/assets/data/events.json');
  }

  landmarks(): Observable<Card[]> {
    return this.http.get<Card[]>('/assets/data/landmarks.json');
  }

  boons(): Observable<Card[]> {
    return this.http.get<Card[]>('/assets/data/boons.json');
  }

  hexes(): Observable<Card[]> {
    return this.http.get<Card[]>('/assets/data/hexes.json');
  }

  states(): Observable<Card[]> {
    return this.http.get<Card[]>('/assets/data/states.json');
  }
}
