import { SpecialCardsCount } from '../models/special-cards-count';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { Configuration } from '../models/configuration';
import { Expansion } from '../models/expansion';
import { map } from 'rxjs/operators';
import { CardTypeId } from '../models/card-type';
import { CardService } from './card.service';
import { Card } from '../models/card';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    static readonly defaultConfiguration: Configuration = {
        expansions: [],
        specialCardsCount: {
            events: 0,
            landmarks: 0,
            projects: 0,
            ways: 0,
        },
    };

    private configurationSubject = new BehaviorSubject<Configuration>(
        ConfigurationService.defaultConfiguration,
    );

    readonly configuration$: Observable<Configuration> = this.configurationSubject.asObservable();

    private readonly enabledExpansions$: Observable<Expansion[]> = this.configuration$.pipe(
        map((configuration: Configuration) => configuration.expansions),
    );

    constructor(private cardService: CardService) {}

    updateExpansions(expansions: Expansion[]): void {
        const configuration = this.configurationSubject.value;
        configuration.expansions = expansions;
        this.configurationSubject.next(configuration);
    }

    updateSpecialCardsCount(count: SpecialCardsCount): void {
        const configuration = this.configurationSubject.value;
        configuration.specialCardsCount = count;
        this.configurationSubject.next(configuration);
    }

    isCardTypeAvailable(type: CardTypeId): Observable<boolean> {
        return combineLatest(this.cardService.findByCardType(type), this.enabledExpansions$).pipe(
            map(([cardsOfType, enabledExpansions]: [Card[], Expansion[]]) => {
                return cardsOfType.some((card: Card) =>
                    card.expansions.some((expansion: Expansion) =>
                        enabledExpansions.includes(expansion),
                    ),
                );
            }),
        );
    }
}
