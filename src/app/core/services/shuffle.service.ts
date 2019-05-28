import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Card } from '../models/card';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Configuration } from '../models/configuration';

@Injectable({
  providedIn: 'root'
})
export class ShuffleService {

  constructor(private dataService: DataService ) { }

  shuffle(configuration: Configuration): Observable<Card[]> {
    return this.dataService.cards().pipe(
      map((cards: Card[]) => cards.slice(0, 9))
    );
  }
}
