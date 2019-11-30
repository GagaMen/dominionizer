import { Injectable } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { Configuration } from '../models/configuration';
import { Extension } from '../models/extension';
import { map } from 'rxjs/operators';
import { CardType } from '../models/card-type';
import { CardService } from './card.service';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private configurationSubject = new BehaviorSubject<Configuration>({
    extensions: [],
    options: {
      events: 0,
      landmarks: 0,
      boons: 0,
      hexes: 0,
      states: 0,
    }
  });

  readonly configuration$: Observable<Configuration> = this.configurationSubject.asObservable();

  private readonly enabledExtensions$: Observable<Extension[]> = this.configuration$.pipe(
    map((configuration: Configuration) => configuration.extensions),
  );

  constructor(private cardService: CardService) { }

  updateExtensions(extensions: Extension[]): void {
    const configuration = this.configurationSubject.value;
    configuration.extensions = extensions;
    this.configurationSubject.next(configuration);
  }

  isCardTypeAvailable(type: CardType): Observable<boolean> {
   return combineLatest(
      this.cardService.findByCardType(type),
      this.enabledExtensions$
    ).pipe(
      map(([cardsOfType, enabledExtensions]: [Card[], Extension[]]) => {
        const extensionIds = new Set<number>();
        enabledExtensions.forEach((extension: Extension) => extensionIds.add(extension.id));

        return cardsOfType.some((card: Card) => extensionIds.has(card.extension.id));
      }),
    );
  }
}
