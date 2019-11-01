import { Configuration } from './../models/configuration';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Card } from '../models/card';
import { Observable } from 'rxjs';
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
    return this.dataService.events().pipe(
      map((cards: Card[]) => this.filterByExtensions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.eventCount))
    );
  }

  shuffleLandmarks(): Observable<Card[]> {
    return this.dataService.events().pipe(
      map((cards: Card[]) => this.filterByExtensions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.landmarkCount))
    );
  }

  shuffleBoons(): Observable<Card[]> {
    return this.dataService.events().pipe(
      map((cards: Card[]) => this.filterByExtensions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.boonCount))
    );
  }

  shuffleHexes(): Observable<Card[]> {
    return this.dataService.events().pipe(
      map((cards: Card[]) => this.filterByExtensions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.hexCount))
    );
  }

  shuffleStates(): Observable<Card[]> {
    return this.dataService.events().pipe(
      map((cards: Card[]) => this.filterByExtensions(cards)),
      map((cards: Card[]) => this.pickRandom(cards, this.configuration.options.stateCount))
    );
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
