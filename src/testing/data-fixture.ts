import { AppBarConfiguration, NavigationAction } from './../app/models/app-bar-configuration';
import { Expansion } from 'src/app/models/expansion';
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
    private expansionIdCount = 0;
    private cardTypeIdCount = 0;
    private cardDtoIdCount = 0;
    private cardIdCount = 0;

    createExpansion(expansion: Partial<Expansion> = {}): Expansion {
        return {
            id: this.expansionIdCount++,
            name: this.chance.word(),
            icon: this.chance.word(),
            ...expansion,
        };
    }

    createExpansions(amount = 3, expansion: Partial<Expansion> = {}): Expansion[] {
        return this.createMultiple(
            (expansion?: Partial<Expansion>) => this.createExpansion(expansion),
            amount,
            expansion,
        );
    }

    createCardDto(cardDto: Partial<CardDto> = {}): CardDto {
        return {
            id: this.cardDtoIdCount++,
            name: this.chance.word(),
            description: this.chance.sentence(),
            image: this.chance.string(),
            wikiUrl: this.chance.url(),
            expansions: [this.chance.integer({ min: 1, max: 10 })],
            types: [this.chance.integer({ min: 1, max: 10 })],
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
            id: this.cardTypeIdCount++,
            name: this.chance.word(),
            ...cardType,
        };
    }

    createCardTypes(amount = 3): CardType[] {
        return this.createMultiple(() => this.createCardType(), amount);
    }

    createCard(card: Partial<Card> = {}): Card {
        return {
            id: this.cardIdCount++,
            name: this.chance.word(),
            description: this.chance.sentence(),
            image: this.chance.string(),
            wikiUrl: this.chance.url(),
            expansions: [this.createExpansion()],
            types: [this.createCardType()],
            isKingdomCard: this.chance.bool(),
            cost: this.chance.integer({ min: 0, max: 5 }),
            ...card,
        };
    }

    createCards(amount = 3, card: Partial<Card> = {}): Card[] {
        return this.createMultiple((card?: Partial<Card>) => this.createCard(card), amount, card);
    }

    createConfiguration(configuration: Partial<Configuration> = {}): Configuration {
        return {
            expansions: this.createExpansions(),
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
