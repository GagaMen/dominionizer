import { Configuration } from './../models/configuration';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Card } from '../models/card';
import { Observable, of, iif } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import * as math from 'mathjs';
import { Extension } from '../models/extension';

@Injectable({
  providedIn: 'root'
})
export class ShuffleService {
  configuration: Configuration;

  constructor(private dataService: DataService ) { }

  shuffleCards(): Observable<Card[]> {
    return this.dataService.cards().pipe(
      map((cards: Card[]) => this.filterByExtensions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, 10))
    );
  }

  shuffleEvents(): Observable<Card[]> {
    const events$ = this.dataService.events().pipe(
      map((cards: Card[]) => this.filterByExtensions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.eventCount)
    ));

    return iif(() => this.configuration.options.events, events$, of(null));
  }

  shuffleLandmarks(): Observable<Card[]> {
    const landmarks$ = this.dataService.landmarks().pipe(
      map((cards: Card[]) => this.filterByExtensions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.landmarkCount)
    ));

    return iif(() => this.configuration.options.landmarks, landmarks$, of(null));
  }

  shuffleBoons(): Observable<Card[]> {
    const boons$ = this.dataService.boons().pipe(
      map((cards: Card[]) => this.filterByExtensions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.boonCount)
    ));

    return iif(() => this.configuration.options.boons, boons$, of(null));
  }

  shuffleHexes(): Observable<Card[]> {
    const hexes$ = this.dataService.hexes().pipe(
      map((cards: Card[]) => this.filterByExtensions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.hexCount)
    ));

    return iif(() => this.configuration.options.hexes, hexes$, of(null));
  }

  shuffleStates(): Observable<Card[]> {
    const states$ = this.dataService.states().pipe(
      map((cards: Card[]) => this.filterByExtensions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.stateCount)
    ));

    return iif(() => this.configuration.options.states, states$, of(null));
  }

  pickRandom(cards: Card[], amount: number): Card[] {
    const pickedCardIds = math.pickRandom(cards.map((card: Card) => card.id), amount) as any as number[];
    return pickedCardIds.map((cardId: number) => cards.find((card: Card) => card.id === cardId));
  }

  filterByExtensions(cards: Card[]): Card[] {
    return cards.filter((card: Card) =>
      this.configuration.extensions.map((extension: Extension) => extension.id).includes(card.extension.id)
    );
  }
}
