import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expansion } from '../models/expansion';
import { CardDto } from '../dtos/card-dto';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  static expansionsUrl = '/assets/data/expansions.json';
  static cardsUrl = '/assets/data/cards.json';

  constructor(private http: HttpClient) { }

  expansions(): Observable<Expansion[]> {
    return this.http.get<Expansion[]>(DataService.expansionsUrl);
  }

  cards(): Observable<CardDto[]> {
    return this.http.get<CardDto[]>(DataService.cardsUrl);
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
