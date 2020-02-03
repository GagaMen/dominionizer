import { Options } from './../models/options';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { Configuration } from '../models/configuration';
import { Expansion } from '../models/expansion';
import { map } from 'rxjs/operators';
import { CardType } from '../models/card-type';
import { CardService } from './card.service';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private configurationSubject = new BehaviorSubject<Configuration>({
    expansions: [],
    options: {
      events: 0,
      landmarks: 0,
      boons: 0,
      hexes: 0,
      states: 0,
    },
    costDistribution: new Map<number, number>(),
  });

  readonly configuration$: Observable<Configuration> = this.configurationSubject.asObservable();

  private readonly enabledExpansions$: Observable<Expansion[]> = this.configuration$.pipe(
    map((configuration: Configuration) => configuration.expansions),
  );

  constructor(private cardService: CardService) { }

  updateExpansions(expansions: Expansion[]): void {
    const configuration = this.configurationSubject.value;
    configuration.expansions = expansions;
    this.configurationSubject.next(configuration);
  }

  updateOptions(options: Options): void {
    const configuration = this.configurationSubject.value;
    configuration.options = options;
    this.configurationSubject.next(configuration);
  }

  isCardTypeAvailable(type: CardType): Observable<boolean> {
   return combineLatest(
      this.cardService.findByCardType(type),
      this.enabledExpansions$
    ).pipe(
      map(([cardsOfType, enabledExpansions]: [Card[], Expansion[]]) => {
        // TODO: intermediate step, that determines the expansion ids, can be deleted when it is
        //       ensured that expansion objects exist only once in the whole app
        const expansionIds = new Set<number>();
        enabledExpansions.forEach((expansion: Expansion) => expansionIds.add(expansion.id));

        return cardsOfType.some((card: Card) =>
          card.expansions.some((expansion: Expansion) => expansionIds.has(expansion.id))
        );
      }),
    );
  }
}
