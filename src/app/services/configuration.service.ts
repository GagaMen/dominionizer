import { SpecialCardsCount } from '../models/special-cards-count';
import { Injectable, inject, signal } from '@angular/core';
import { Configuration } from '../models/configuration';
import { Edition } from '../models/edition';
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

    private readonly configurationState = signal<Configuration>({
        ...ConfigurationService.defaultConfiguration,
    });

    readonly configuration = this.configurationState.asReadonly();

    updateEditions(editions: Edition[]): void {
        this.configurationState.update((configuration: Configuration) => ({
            ...configuration,
            editions,
        }));
    }

    updateSpecialCardsCount(count: SpecialCardsCount): void {
        this.configurationState.update((configuration: Configuration) => ({
            ...configuration,
            specialCardsCount: count,
        }));
    }

    isCardTypeAvailable(type: CardTypeId): boolean {
        const enabledEditionIds = this.configuration().editions.map(
            (edition: Edition) => edition.id,
        );

        return this.cardService
            .findByCardType(type)
            .some((card: Card) =>
                card.editions.some((edition: Edition) => enabledEditionIds.includes(edition.id)),
            );
    }
}
