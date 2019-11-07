import { Injectable } from '@angular/core';
import { CardType } from '../models/card-type';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { Card } from '../models/card';
import { filter, map, tap } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private readonly cards$: Observable<Card[]>;

  constructor(private dataService: DataService) {
    this.cards$ = forkJoin([
      this.dataService.cards(),
      this.dataService.events(),
      this.dataService.landmarks(),
      this.dataService.boons(),
      this.dataService.hexes(),
      this.dataService.states()
    ]).pipe(
      map((cardArrays: Array<Card[]>) =>
        cardArrays.reduce((result: Card[], cards: Card[]) => result.concat(cards))
      )
    );
  }

  findByCardType(type: CardType): Observable<Card[]> {
    return this.cards$.pipe(
      map((cards: Card[]) =>
        cards.filter((card: Card) => card.types.includes(type))
      ),
    );
  }
}
