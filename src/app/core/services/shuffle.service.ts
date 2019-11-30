import { Configuration } from './../models/configuration';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Card } from '../models/card';
import { Observable, of, iif } from 'rxjs';
import { map } from 'rxjs/operators';
import * as math from 'mathjs';
import { Expansion } from '../models/expansion';

@Injectable({
  providedIn: 'root'
})
export class ShuffleService {
  configuration: Configuration;

  constructor(private dataService: DataService ) { }

  shuffleCards(): Observable<Card[]> {
    return this.dataService.cards().pipe(
      map((cards: Card[]) => this.filterByExpansions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, 10))
    );
  }

  shuffleEvents(): Observable<Card[]> {
    const events$ = this.dataService.events().pipe(
      map((cards: Card[]) => this.filterByExpansions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.events)
    ));

    return iif(() => this.configuration.options.events > 0, events$, of([]));
  }

  shuffleLandmarks(): Observable<Card[]> {
    const landmarks$ = this.dataService.landmarks().pipe(
      map((cards: Card[]) => this.filterByExpansions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.landmarks)
    ));

    return iif(() => this.configuration.options.landmarks > 0, landmarks$, of([]));
  }

  shuffleBoons(): Observable<Card[]> {
    const boons$ = this.dataService.boons().pipe(
      map((cards: Card[]) => this.filterByExpansions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.boons)
    ));

    return iif(() => this.configuration.options.boons > 0, boons$, of([]));
  }

  shuffleHexes(): Observable<Card[]> {
    const hexes$ = this.dataService.hexes().pipe(
      map((cards: Card[]) => this.filterByExpansions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.hexes)
    ));

    return iif(() => this.configuration.options.hexes > 0, hexes$, of([]));
  }

  shuffleStates(): Observable<Card[]> {
    const states$ = this.dataService.states().pipe(
      map((cards: Card[]) => this.filterByExpansions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.states)
    ));

    return iif(() => this.configuration.options.states > 0, states$, of([]));
  }

  pickRandom(cards: Card[], amount: number): Card[] {
    const pickedCardIds = math.pickRandom(cards.map((card: Card) => card.id), amount) as any as number[];
    return pickedCardIds.map((cardId: number) => cards.find((card: Card) => card.id === cardId));
  }

  filterByExpansions(cards: Card[]): Card[] {
    return cards.filter((card: Card) =>
      this.configuration.expansions.map((expansion: Expansion) => expansion.id).includes(card.expansion.id)
    );
  }
}
