import { CardTranslation } from 'src/app/models/card';
import { CardDto } from './../dtos/card-dto';
import { Injectable, inject } from '@angular/core';
import { CardType, CardTypeId } from '../models/card-type';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { Card } from '../models/card';
import { map, first } from 'rxjs/operators';
import { DataService } from './data.service';
import { EditionService } from './edition.service';
import { Edition } from '../models/edition';
import { CardTypeService } from './card-type.service';

@Injectable({
    providedIn: 'root',
})
export class CardService {
    private dataService = inject(DataService);
    private editionService = inject(EditionService);
    private cardTypeService = inject(CardTypeService);

    private cardsSubject: BehaviorSubject<Map<string, Card>> = new BehaviorSubject<
        Map<string, Card>
    >(new Map());

    get cards$(): Observable<Map<string, Card>> {
        return this.cardsSubject.pipe(first((cards: Map<string, Card>) => cards.size !== 0));
    }

    constructor() {
        forkJoin({
            cardDtos: this.dataService.fetchCards(),
            editions: this.editionService.editions$,
            cardTypes: this.cardTypeService.cardTypes$,
            translations: this.dataService.fetchCardTranslations(),
        })
            .pipe(
                map(({ cardDtos, editions, cardTypes, translations }) => {
                    cardDtos.forEach((cardDto: CardDto) => {
                        const translation = translations.find(
                            (translation: CardTranslation) => translation.id === cardDto.id,
                        );
                        if (translation === undefined) {
                            return;
                        }

                        if (translation.name.trim().length > 0) {
                            cardDto.name = translation.name;
                        }

                        if (translation.description.trim().length > 0) {
                            cardDto.description = translation.description;
                        }
                    });

                    return { cardDtos, editions, cardTypes };
                }),
            )
            .subscribe(({ cardDtos, editions, cardTypes }) =>
                this.cardsSubject.next(this.mapCardDtosToCards(cardDtos, editions, cardTypes)),
            );
    }

    private mapCardDtosToCards(
        cardDtos: CardDto[],
        editions: Edition[],
        cardTypes: CardType[],
    ): Map<string, Card> {
        const cards = new Map<string, Card>();

        cardDtos.forEach((cardDto: CardDto) => {
            cards.set(cardDto.id, {
                ...cardDto,
                editions: editions.filter((edition: Edition) =>
                    cardDto.editions.includes(edition.id),
                ),
                types: cardTypes.filter((cardType: CardType) =>
                    cardDto.types.includes(cardType.id),
                ),
            });
        });

        return cards;
    }

    findRandomizableKingdomCards(): Observable<Card[]> {
        return this.cards$.pipe(
            map((cards: Map<string, Card>) =>
                Array.from(cards.values()).filter((card: Card) => card.isKingdomCard),
            ),
        );
    }

    findByCardType(typeId: CardTypeId): Observable<Card[]> {
        return this.cards$.pipe(
            map((cards: Map<string, Card>) =>
                Array.from(cards.values()).filter((card: Card) =>
                    card.types.some((type: CardType) => type.id === typeId),
                ),
            ),
        );
    }
}
