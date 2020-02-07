import { Injectable } from '@angular/core';
import { CardType } from '../models/card-type';
import { Observable, combineLatest, forkJoin, BehaviorSubject } from 'rxjs';
import { Card } from '../models/card';
import { filter, map, tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { ExpansionService } from './expansion.service';
import { CardDto } from '../dtos/card-dto';
import { Expansion } from '../models/expansion';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private cardsSubject: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

  readonly cards$: Observable<Card[]> = this.cardsSubject.asObservable();

  constructor(private dataService: DataService, private expansionService: ExpansionService) {
    combineLatest([
      this.dataService.cards(),
      this.expansionService.expansions$,
    ]).pipe(
      filter((data: [CardDto[], Expansion[]]) => data[1].length !== 0),
    ).subscribe((data: [CardDto[], Expansion[]]) =>
      this.cardsSubject.next(this.mapCardDtosToCards(data))
    );
  }

  private mapCardDtosToCards(data: [CardDto[], Expansion[]]) {
    const [cardDtos, expansions] = data;

    return cardDtos.map((cardDto: CardDto) => {
      return {
        ...cardDto,
        expansions: expansions.filter((expansion: Expansion) =>
          cardDto.expansions.includes(expansion.id)
        ),
      };
    });
  }

  findByCardType(type: CardType): Observable<Card[]> {
    return this.cards$.pipe(
      map((cards: Card[]) =>
        cards.filter((card: Card) => card.types.includes(type))
      ),
    );
  }
}
