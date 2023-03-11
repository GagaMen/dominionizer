import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { MatCardModule, MatCardTitle, MatCardSubtitle, MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DataFixture } from 'src/testing/data-fixture';
import { environment } from 'src/environments/environment';
import { CardTypeId } from 'src/app/models/card-type';
import { By } from '@angular/platform-browser';

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;
    let dataFixture: DataFixture;
    const expansionIconUrl = '/assets/card_symbols/Dominion_icon.png';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatCardModule, MatIconModule],
            declarations: [CardComponent],
        });

        dataFixture = new DataFixture();

        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
    });

    describe('expansionIconUrl', () => {
        it('with card belongs to no expansion should return null', () => {
            component.card = dataFixture.createCard({ expansions: [] });

            const actual = component.expansionIconUrl;

            expect(actual).toBeNull();
        });

        it('with expansion of card has no icon should return null', () => {
            const expansion = dataFixture.createExpansion({ icon: '' });
            component.card = dataFixture.createCard({ expansions: [expansion] });

            const actual = component.expansionIconUrl;

            expect(actual).toBeNull();
        });

        it('with single expansion of card has icon should return correct icon url', () => {
            const expansion = dataFixture.createExpansion({ icon: 'expansion.png' });
            component.card = dataFixture.createCard({ expansions: [expansion] });
            const expected = `${environment.entryPoint}/assets/card_symbols/expansion.png`;

            const actual = component.expansionIconUrl;

            expect(actual).toBe(expected);
        });

        it('with multiple expansions of card have icon should return correct icon url', () => {
            const firstEditionExpansion = dataFixture.createExpansion({
                id: 1,
                icon: 'old_expansion.png',
            });
            const secondEditionExpansion = dataFixture.createExpansion({
                id: 1.1,
                icon: 'expansion.png',
            });
            component.card = dataFixture.createCard({
                expansions: [firstEditionExpansion, secondEditionExpansion],
            });
            const expected = `${environment.entryPoint}/assets/card_symbols/expansion.png`;

            const actual = component.expansionIconUrl;

            expect(actual).toBe(expected);
        });
    });

    describe('costIconUrls', () => {
        it('with card has cost should return correct icon urls', () => {
            component.card = dataFixture.createCard({ cost: 2 });
            const expected = [`${environment.entryPoint}/assets/card_symbols/Coin2.png`];

            const actual = component.costIconUrls;

            expect(actual).toEqual(expected);
        });

        const costModifiers = [
            ['P', 'Potion.png'],
            ['*', 'Coin0star.png'],
            ['+', 'Coin0plus.png'],
        ];
        for (const [costModifier, image] of costModifiers) {
            it(`with card has '${costModifier}' cost modifier should return correct icon urls`, () => {
                component.card = dataFixture.createCard({ cost: 0, costModifier });
                const expected = [`${environment.entryPoint}/assets/card_symbols/${image}`];

                const actual = component.costIconUrls;

                expect(actual).toEqual(expected);
            });
        }

        it(`with card has cost and 'P' cost modifier should return correct icon urls`, () => {
            component.card = dataFixture.createCard({ cost: 3, costModifier: 'P' });
            const expected = [
                `${environment.entryPoint}/assets/card_symbols/Coin3.png`,
                `${environment.entryPoint}/assets/card_symbols/Potion.png`,
            ];

            const actual = component.costIconUrls;

            expect(actual).toEqual(expected);
        });

        it('with card has cost equals zero and debt greater than zero should return correct icon urls', () => {
            component.card = dataFixture.createCard({ cost: 0, debt: 8 });
            const expected = [`${environment.entryPoint}/assets/card_symbols/Debt8.png`];

            const actual = component.costIconUrls;

            expect(actual).toEqual(expected);
        });

        it('with card has cost and debt greater than zero should return correct icon urls', () => {
            component.card = dataFixture.createCard({ cost: 4, debt: 4 });
            const expected = [
                `${environment.entryPoint}/assets/card_symbols/Coin4.png`,
                `${environment.entryPoint}/assets/card_symbols/Debt4.png`,
            ];

            const actual = component.costIconUrls;

            expect(actual).toEqual(expected);
        });
    });

    describe('typesLabel', () => {
        it('with card has one type should return correct label', () => {
            const type = dataFixture.createCardType();
            component.card = dataFixture.createCard({ types: [type] });

            const actual = component.typesLabel;

            expect(actual).toBe(type.name);
        });

        it('with card has multiple types should return correct label', () => {
            const firstType = dataFixture.createCardType();
            const secondType = dataFixture.createCardType();
            component.card = dataFixture.createCard({ types: [firstType, secondType] });
            const expected = `${firstType.name} - ${secondType.name}`;

            const actual = component.typesLabel;

            expect(actual).toBe(expected);
        });
    });

    describe('color', () => {
        const calculateColor = (topCardType: CardTypeId, bottomCardType?: CardTypeId) => {
            const topColor = CardComponent.colorOfCardTypes.get(topCardType);
            const bottomColor = bottomCardType
                ? CardComponent.colorOfCardTypes.get(bottomCardType)
                : undefined;

            if (topColor && bottomColor) {
                return `linear-gradient(${topColor} 50%, ${bottomColor} 50%)`;
            }
            if (topColor) {
                return topColor;
            }

            return '';
        };
        const cardTypeCompinations: { typeIds: CardTypeId[]; expected: string }[] = [
            { typeIds: [CardTypeId.Action], expected: calculateColor(CardTypeId.Action) },
            { typeIds: [CardTypeId.Duration], expected: calculateColor(CardTypeId.Duration) },
            { typeIds: [CardTypeId.Event], expected: calculateColor(CardTypeId.Event) },
            { typeIds: [CardTypeId.Landmark], expected: calculateColor(CardTypeId.Landmark) },
            { typeIds: [CardTypeId.Night], expected: calculateColor(CardTypeId.Night) },
            { typeIds: [CardTypeId.Project], expected: calculateColor(CardTypeId.Project) },
            { typeIds: [CardTypeId.Reaction], expected: calculateColor(CardTypeId.Reaction) },
            { typeIds: [CardTypeId.Reserve], expected: calculateColor(CardTypeId.Reserve) },
            { typeIds: [CardTypeId.Ruins], expected: calculateColor(CardTypeId.Ruins) },
            { typeIds: [CardTypeId.Shelter], expected: calculateColor(CardTypeId.Shelter) },
            { typeIds: [CardTypeId.Treasure], expected: calculateColor(CardTypeId.Treasure) },
            { typeIds: [CardTypeId.Victory], expected: calculateColor(CardTypeId.Victory) },
            { typeIds: [CardTypeId.Way], expected: calculateColor(CardTypeId.Way) },
            { typeIds: [CardTypeId.Trait], expected: calculateColor(CardTypeId.Trait) },
            { typeIds: [CardTypeId.Ally], expected: calculateColor(CardTypeId.Ally) },
            {
                typeIds: [CardTypeId.Action, CardTypeId.Duration],
                expected: calculateColor(CardTypeId.Duration),
            },
            {
                typeIds: [CardTypeId.Action, CardTypeId.Night],
                expected: calculateColor(CardTypeId.Action),
            },
            {
                typeIds: [CardTypeId.Action, CardTypeId.Reaction],
                expected: calculateColor(CardTypeId.Reaction),
            },
            {
                typeIds: [CardTypeId.Action, CardTypeId.Ruins],
                expected: calculateColor(CardTypeId.Ruins),
            },
            {
                typeIds: [CardTypeId.Action, CardTypeId.Shelter],
                expected: calculateColor(CardTypeId.Action, CardTypeId.Shelter),
            },
            {
                typeIds: [CardTypeId.Action, CardTypeId.Treasure],
                expected: calculateColor(CardTypeId.Action, CardTypeId.Treasure),
            },
            {
                typeIds: [CardTypeId.Action, CardTypeId.Victory],
                expected: calculateColor(CardTypeId.Action, CardTypeId.Victory),
            },
            {
                typeIds: [CardTypeId.Duration, CardTypeId.Reaction],
                expected: calculateColor(CardTypeId.Duration, CardTypeId.Reaction),
            },
            {
                typeIds: [CardTypeId.Night, CardTypeId.Duration],
                expected: calculateColor(CardTypeId.Duration),
            },
            {
                typeIds: [CardTypeId.Reaction, CardTypeId.Shelter],
                expected: calculateColor(CardTypeId.Reaction, CardTypeId.Shelter),
            },
            {
                typeIds: [CardTypeId.Reserve, CardTypeId.Victory],
                expected: calculateColor(CardTypeId.Reserve, CardTypeId.Victory),
            },
            {
                typeIds: [CardTypeId.Treasure, CardTypeId.Reserve],
                expected: calculateColor(CardTypeId.Treasure, CardTypeId.Reserve),
            },
            {
                typeIds: [CardTypeId.Treasure, CardTypeId.Victory],
                expected: calculateColor(CardTypeId.Treasure, CardTypeId.Victory),
            },
            {
                typeIds: [CardTypeId.Treasure, CardTypeId.Reaction],
                expected: calculateColor(CardTypeId.Treasure, CardTypeId.Reaction),
            },
            {
                typeIds: [CardTypeId.Victory, CardTypeId.Shelter],
                expected: calculateColor(CardTypeId.Victory, CardTypeId.Shelter),
            },
            {
                typeIds: [CardTypeId.Victory, CardTypeId.Reaction],
                expected: calculateColor(CardTypeId.Victory, CardTypeId.Reaction),
            },
            {
                typeIds: [CardTypeId.Action, CardTypeId.Duration, CardTypeId.Reaction],
                expected: calculateColor(CardTypeId.Duration, CardTypeId.Reaction),
            },
            {
                typeIds: [CardTypeId.Treasure, CardTypeId.Duration],
                expected: calculateColor(CardTypeId.Treasure, CardTypeId.Duration),
            },
            {
                typeIds: [CardTypeId.Action, CardTypeId.Reserve, CardTypeId.Victory],
                expected: calculateColor(CardTypeId.Reserve, CardTypeId.Victory),
            },
        ];

        it('with card has given card types should return correct color', () => {
            cardTypeCompinations.forEach(({ typeIds, expected }) => {
                const types = typeIds.map((typeId: CardTypeId) =>
                    dataFixture.createCardType({ id: typeId }),
                );
                component.card = dataFixture.createCard({ types });

                const actual = component.color;

                expect(actual).toBe(
                    expected,
                    `for types [${typeIds.map((type) => CardTypeId[type]).join(', ')}]`,
                );
            });
        });
    });

    describe('template', () => {
        let expansionIconUrlSpy: jasmine.Spy;
        let costIconUrlsSpy: jasmine.Spy;

        beforeEach(() => {
            expansionIconUrlSpy = spyOnProperty(component, 'expansionIconUrl');
            expansionIconUrlSpy.and.returnValue(expansionIconUrl);
            costIconUrlsSpy = spyOnProperty(component, 'costIconUrls');
            costIconUrlsSpy.and.returnValue([]);
        });

        it('should bind "background" style of MatCard correctly', () => {
            const color = '#999';
            const expected = 'rgb(153, 153, 153)';
            spyOnProperty(component, 'color').and.returnValue(color);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(MatCard)).styles.background;

            expect(actual).toBe(expected);
        });

        it('with expansionIconUrl is null should not display expansion icon', () => {
            expansionIconUrlSpy.and.returnValue(null);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('.expansion-icon'));

            expect(actual).toBeNull();
        });

        it('with expansionIconUrl is not null should display expansion icon', () => {
            expansionIconUrlSpy.and.returnValue(expansionIconUrl);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('.expansion-icon'));

            expect(actual).not.toBeNull();
        });

        it('with expansionIconUrl is not null should bind src of expansion icon correctly', () => {
            const expected = expansionIconUrl;
            expansionIconUrlSpy.and.returnValue(expected);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('.expansion-icon')).properties.src;

            expect(actual).toBe(expected);
        });

        it('should display cost icons correctly', () => {
            const expected = ['/assets/card_symbols/Coin1.png', '/assets/card_symbols/Potion.png'];
            costIconUrlsSpy.and.returnValue(expected);
            fixture.detectChanges();

            const actual = fixture.debugElement
                .queryAll(By.css('.cost-icon'))
                .map((costIcon) => costIcon.properties.src as string);

            expect(actual).toEqual(expected);
        });

        it('should bind content of MatCardTitle correctly', () => {
            const card = dataFixture.createCard();
            component.card = card;
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(MatCardTitle)).properties
                .innerText;

            expect(actual).toBe(card.name);
        });

        it('should bind content of MatCardSubtitle correctly', () => {
            const card = dataFixture.createCard();
            component.card = card;
            const expected = 'Action - Attack';
            spyOnProperty(component, 'typesLabel').and.returnValue(expected);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(MatCardSubtitle)).properties
                .innerText;

            expect(actual).toBe(expected);
        });

        it('should bind click event of MatIconButton correctly', () => {
            const reshuffleEmitSpy = spyOn(component.reshuffle, 'emit');
            fixture.detectChanges();

            fixture.debugElement.query(By.css('[mat-icon-button]')).nativeElement.click();

            expect(reshuffleEmitSpy).toHaveBeenCalled();
        });
    });
});
