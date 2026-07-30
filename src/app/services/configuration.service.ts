import { SpecialCardsCount } from '../models/special-cards-count';
import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { Configuration } from '../models/configuration';
import { Edition } from '../models/edition';
import { map } from 'rxjs/operators';
import { CardTypeId } from '../models/card-type';
import { CardService } from './card.service';
import { Card } from '../models/card';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    private cardService = inject(CardService);

    static readonly defaultConfiguration: Configuration = {
        editions: [],
        specialCardsCount: {
            events: 0,
            landmarks: 0,
            projects: 0,
            ways: 0,
            traits: 0,
        },
    };

    private configurationSubject = new BehaviorSubject<Configuration>({
        ...ConfigurationService.defaultConfiguration,
    });

    readonly configuration$: Observable<Configuration> = this.configurationSubject.asObservable();

    private readonly enabledEditions$: Observable<Edition[]> = this.configuration$.pipe(
        map((configuration: Configuration) => configuration.editions),
    );

    updateEditions(editions: Edition[]): void {
        this.configurationSubject.next({ ...this.configurationSubject.value, editions });
    }

    updateSpecialCardsCount(count: SpecialCardsCount): void {
        this.configurationSubject.next({
            ...this.configurationSubject.value,
            specialCardsCount: count,
        });
    }

    isCardTypeAvailable(type: CardTypeId): Observable<boolean> {
        return combineLatest([this.cardService.findByCardType(type), this.enabledEditions$]).pipe(
            map(([cardsOfType, enabledEditions]: [Card[], Edition[]]) => {
                const enabledEditionIds = enabledEditions.map((edition: Edition) => edition.id);

                return cardsOfType.some((card: Card) =>
                    card.editions.some((edition: Edition) =>
                        enabledEditionIds.includes(edition.id),
                    ),
                );
            }),
        );
    }
}
