import { CardTypeTranslation } from './../app/models/card-type';
import { EditionTranslation } from './../app/models/edition';
import { CardTranslation } from './../app/models/card';
import { AppBarConfiguration, NavigationAction } from './../app/models/app-bar-configuration';
import { Edition } from 'src/app/models/edition';
import { Chance } from 'chance';
import { CardDto } from 'src/app/dtos/card-dto';
import { Card } from 'src/app/models/card';
import { CardType } from 'src/app/models/card-type';
import { Configuration } from 'src/app/models/configuration';
import { Set } from 'src/app/models/set';
import { GroupingOption, SortingOption } from 'src/app/services/set.service';
import { SpecialCardsAvailability } from 'src/app/models/special-cards-availability';
import { SpecialCardsCount } from 'src/app/models/special-cards-count';

export class DataFixture {
    private chance: Chance.Chance = new Chance();
    private editionIdCount = 0;
    private cardTypeIdCount = 0;
    private cardDtoIdCount = 0;
    private cardIdCount = 0;
    private editionTranslationIdCount = 0;
    private cardTypeTranslationIdCount = 0;
    private cardTranslationIdCount = 0;

    createEdition(edition: Partial<Edition> = {}): Edition {
        return {
            id: String(this.editionIdCount++),
            expansion: this.chance.word(),
            edition: String(this.chance.integer({ min: 1, max: 2 })),
            icon: this.chance.word(),
            ...edition,
        };
    }

    createEditions(amount = 3, edition: Partial<Edition> = {}): Edition[] {
        return this.createMultiple(
            (edition?: Partial<Edition>) => this.createEdition(edition),
            amount,
            edition,
        );
    }

    createEditionTranslation(
        editionTranslation: Partial<EditionTranslation> = {},
    ): EditionTranslation {
        return {
            id: String(this.editionTranslationIdCount++),
            expansion: this.chance.word(),
            ...editionTranslation,
        };
    }

    createEditionTranslations(
        amount = 3,
        editionTranslation: Partial<EditionTranslation> = {},
    ): EditionTranslation[] {
        return this.createMultiple(
            (editionTranslation?: Partial<EditionTranslation>) =>
                this.createEditionTranslation(editionTranslation),
            amount,
            editionTranslation,
        );
    }

    createCardDto(cardDto: Partial<CardDto> = {}): CardDto {
        return {
            id: String(this.cardDtoIdCount++),
            name: this.chance.word(),
            description: this.chance.sentence(),
            image: this.chance.string(),
            illustrator: this.chance.name(),
            wikiUrl: this.chance.url(),
            editions: [String(this.chance.integer({ min: 1, max: 10 }))],
            types: [String(this.chance.integer({ min: 1, max: 10 }))],
            isKingdomCard: this.chance.bool(),
            cost: this.chance.integer({ min: 0, max: 5 }),
            ...cardDto,
        };
    }

    createCardDtos(amount = 3, cardDto: Partial<CardDto> = {}): CardDto[] {
        return this.createMultiple(
            (cardDto?: Partial<CardDto>) => this.createCardDto(cardDto),
            amount,
            cardDto,
        );
    }

    createCardType(cardType: Partial<CardType> = {}): CardType {
        return {
            id: String(this.cardTypeIdCount++),
            name: this.chance.word(),
            scope: this.chance.word(),
            ...cardType,
        };
    }

    createCardTypes(amount = 3, cardType: Partial<CardType> = {}): CardType[] {
        return this.createMultiple(
            (cardType?: Partial<CardType>) => this.createCardType(cardType),
            amount,
            cardType,
        );
    }

    createCardTypeTranslation(
        cardTypeTranslation: Partial<CardTypeTranslation> = {},
    ): CardTypeTranslation {
        return {
            id: String(this.cardTypeTranslationIdCount++),
            name: this.chance.word(),
            ...cardTypeTranslation,
        };
    }

    createCardTypeTranslations(
        amount = 3,
        cardTypeTranslation: Partial<CardTypeTranslation> = {},
    ): CardTypeTranslation[] {
        return this.createMultiple(
            (cardTypeTranslation?: Partial<CardTypeTranslation>) =>
                this.createCardTypeTranslation(cardTypeTranslation),
            amount,
            cardTypeTranslation,
        );
    }

    createCard(card: Partial<Card> = {}): Card {
        return {
            id: String(this.cardIdCount++),
            name: this.chance.word(),
            description: this.chance.sentence(),
            image: this.chance.string(),
            illustrator: this.chance.name(),
            wikiUrl: this.chance.url(),
            editions: [this.createEdition()],
            types: [this.createCardType()],
            isKingdomCard: this.chance.bool(),
            cost: this.chance.integer({ min: 0, max: 5 }),
            ...card,
        };
    }

    createCards(amount = 3, card: Partial<Card> = {}): Card[] {
        return this.createMultiple((card?: Partial<Card>) => this.createCard(card), amount, card);
    }

    createCardTranslation(cardTranslation: Partial<CardTranslation> = {}): CardTranslation {
        return {
            id: String(this.cardTranslationIdCount++),
            name: this.chance.word(),
            description: this.chance.sentence(),
            ...cardTranslation,
        };
    }

    createCardTranslations(
        amount = 3,
        cardTranslation: Partial<CardTranslation> = {},
    ): CardTranslation[] {
        return this.createMultiple(
            (cardTranslation?: Partial<CardTranslation>) =>
                this.createCardTranslation(cardTranslation),
            amount,
            cardTranslation,
        );
    }

    createConfiguration(configuration: Partial<Configuration> = {}): Configuration {
        return {
            editions: this.createEditions(),
            specialCardsCount: this.createSpecialCardsCount(),
            ...configuration,
        };
    }

    createSpecialCardsCount(count: Partial<SpecialCardsCount> = {}): SpecialCardsCount {
        return {
            events: this.chance.integer({ min: 0, max: 5 }),
            landmarks: this.chance.integer({ min: 0, max: 5 }),
            projects: this.chance.integer({ min: 0, max: 5 }),
            ways: this.chance.integer({ min: 0, max: 5 }),
            traits: this.chance.integer({ min: 0, max: 5 }),
            ...count,
        };
    }

    createSpecialCardsAvailability(
        availability: Partial<SpecialCardsAvailability> = {},
    ): SpecialCardsAvailability {
        return {
            events: this.chance.bool(),
            landmarks: this.chance.bool(),
            projects: this.chance.bool(),
            ways: this.chance.bool(),
            traits: this.chance.bool(),
            ...availability,
        };
    }

    createSet(set: Partial<Set> = {}): Set {
        return {
            kingdomCards: this.createCards(10),
            specialCards: this.createCards(2),
            ...set,
        };
    }

    createGroupingOption(): GroupingOption {
        return this.chance.pickone<GroupingOption>(['without', 'byExpansion']);
    }

    createSortingOption(): SortingOption {
        return this.chance.pickone<SortingOption>(['byName', 'byCost']);
    }

    createAppBarConfiguration(
        configuration: Partial<AppBarConfiguration> = {},
    ): AppBarConfiguration {
        return {
            navigationAction: this.chance.pickone<NavigationAction>(['back', 'sidenav', 'none']),
            actions: [],
            ...configuration,
        };
    }

    private createMultiple<T>(
        create: (props?: Partial<T>) => T,
        amount: number,
        props?: Partial<T>,
    ): T[] {
        const array: T[] = [];
        for (let i = 0; i < amount; i++) {
            array.push(create(props));
        }

        return array;
    }
}
