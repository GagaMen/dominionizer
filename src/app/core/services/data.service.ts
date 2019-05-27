import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Extension } from '../models/extension';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  extensions(): Observable<Extension[]> {
    return this.http.get<Extension[]>('/assets/data/extensions.json');
  }

  cards(): Observable<Card[]> {
    return this.http.get<Card[]>('/assets/data/cards.json');
  }
}
