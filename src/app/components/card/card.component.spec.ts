import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import {
    MatCardModule,
    MatCardAvatar,
    MatCardTitle,
    MatCardSubtitle,
    MatCard,
} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DataFixture } from 'src/testing/data-fixture';
import { environment } from 'src/environments/environment';
import { CardType } from 'src/app/models/card-type';
import { By } from '@angular/platform-browser';

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;
    let dataFixture: DataFixture;
    const expansionIconUrl = '/assets/icons/expansion_dominion.png';

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

        it('with first expansion of card has no icon should return null', () => {
            const expansion = dataFixture.createExpansion({ icon: '' });
            component.card = dataFixture.createCard({ expansions: [expansion] });

            const actual = component.expansionIconUrl;

            expect(actual).toBeNull();
        });

        it('with first expansion of card has icon should return correct icon url', () => {
            const expansion = dataFixture.createExpansion({ icon: '/expansion.png' });
            component.card = dataFixture.createCard({ expansions: [expansion] });
            const expected = `${environment.entryPoint}${expansion.icon}`;

            const actual = component.expansionIconUrl;

            expect(actual).toBe(expected);
        });
    });

    describe('typesLabel', () => {
        it('with card has one type should return correct label', () => {
            const type = dataFixture.createCardType();
            component.card = dataFixture.createCard({ types: [type] });
            const expected = CardType[type];

            const actual = component.typesLabel;

            expect(actual).toBe(expected);
        });

        it('with card has multiple types should return correct label', () => {
            const firstType = dataFixture.createCardType();
            const secondType = dataFixture.createCardType();
            component.card = dataFixture.createCard({ types: [firstType, secondType] });
            const expected = `${CardType[firstType]} - ${CardType[secondType]}`;

            const actual = component.typesLabel;

            expect(actual).toBe(expected);
        });
    });

    describe('color', () => {
        const calculateColor = (topCardType: CardType, bottomCardType?: CardType) => {
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
        const cardTypeCompinations = [
            { types: [CardType.Action], expected: calculateColor(CardType.Action) },
            { types: [CardType.Duration], expected: calculateColor(CardType.Duration) },
            { types: [CardType.Event], expected: calculateColor(CardType.Event) },
            { types: [CardType.Landmark], expected: calculateColor(CardType.Landmark) },
            { types: [CardType.Night], expected: calculateColor(CardType.Night) },
            { types: [CardType.Project], expected: calculateColor(CardType.Project) },
            { types: [CardType.Reaction], expected: calculateColor(CardType.Reaction) },
            { types: [CardType.Reserve], expected: calculateColor(CardType.Reserve) },
            { types: [CardType.Ruins], expected: calculateColor(CardType.Ruins) },
            { types: [CardType.Shelter], expected: calculateColor(CardType.Shelter) },
            { types: [CardType.Treasure], expected: calculateColor(CardType.Treasure) },
            { types: [CardType.Victory], expected: calculateColor(CardType.Victory) },
            { types: [CardType.Way], expected: calculateColor(CardType.Way) },
            {
                types: [CardType.Action, CardType.Duration],
                expected: calculateColor(CardType.Duration),
            },
            {
                types: [CardType.Action, CardType.Night],
                expected: calculateColor(CardType.Action),
            },
            {
                types: [CardType.Action, CardType.Reaction],
                expected: calculateColor(CardType.Reaction),
            },
            {
                types: [CardType.Action, CardType.Ruins],
                expected: calculateColor(CardType.Ruins),
            },
            {
                types: [CardType.Action, CardType.Shelter],
                expected: calculateColor(CardType.Action, CardType.Shelter),
            },
            {
                types: [CardType.Action, CardType.Treasure],
                expected: calculateColor(CardType.Action, CardType.Treasure),
            },
            {
                types: [CardType.Action, CardType.Victory],
                expected: calculateColor(CardType.Action, CardType.Victory),
            },
            {
                types: [CardType.Duration, CardType.Reaction],
                expected: calculateColor(CardType.Duration, CardType.Reaction),
            },
            {
                types: [CardType.Night, CardType.Duration],
                expected: calculateColor(CardType.Duration),
            },
            {
                types: [CardType.Reaction, CardType.Shelter],
                expected: calculateColor(CardType.Reaction, CardType.Shelter),
            },
            {
                types: [CardType.Reserve, CardType.Victory],
                expected: calculateColor(CardType.Reserve, CardType.Victory),
            },
            {
                types: [CardType.Treasure, CardType.Reserve],
                expected: calculateColor(CardType.Treasure, CardType.Reserve),
            },
            {
                types: [CardType.Treasure, CardType.Victory],
                expected: calculateColor(CardType.Treasure, CardType.Victory),
            },
            {
                types: [CardType.Treasure, CardType.Reaction],
                expected: calculateColor(CardType.Treasure, CardType.Reaction),
            },
            {
                types: [CardType.Victory, CardType.Shelter],
                expected: calculateColor(CardType.Victory, CardType.Shelter),
            },
            {
                types: [CardType.Victory, CardType.Reaction],
                expected: calculateColor(CardType.Victory, CardType.Reaction),
            },
            {
                types: [CardType.Action, CardType.Duration, CardType.Reaction],
                expected: calculateColor(CardType.Duration, CardType.Reaction),
            },
            {
                types: [CardType.Action, CardType.Reserve, CardType.Victory],
                expected: calculateColor(CardType.Reserve, CardType.Victory),
            },
        ];

        it('with card has given card types should return correct color', () => {
            cardTypeCompinations.forEach(({ types, expected }) => {
                component.card = dataFixture.createCard({ types: types });

                const actual = component.color;

                expect(actual).toBe(
                    expected,
                    `for types [${types.map((type) => CardType[type]).join(', ')}]`,
                );
            });
        });
    });

    describe('template', () => {
        let expansionIconUrlSpy: jasmine.Spy;

        beforeEach(() => {
            expansionIconUrlSpy = spyOnProperty(component, 'expansionIconUrl');
            expansionIconUrlSpy.and.returnValue(expansionIconUrl);
        });

        it('should bind "background" style of MatCard correctly', () => {
            const color = '#999';
            const expected = 'rgb(153, 153, 153)';
            spyOnProperty(component, 'color').and.returnValue(color);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(MatCard)).styles.background;

            expect(actual).toBe(expected);
        });

        it('with expansionIconUrl is null should not display MatCardAvatar', () => {
            expansionIconUrlSpy.and.returnValue(null);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(MatCardAvatar));

            expect(actual).toBeNull();
        });

        it('with expansionIconUrl is not null should display MatCardAvatar', () => {
            expansionIconUrlSpy.and.returnValue(expansionIconUrl);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(MatCardAvatar));

            expect(actual).not.toBeNull();
        });

        it('with expansionIconUrl is not null should bind MatCardAvatar.src correctly', () => {
            const expected = expansionIconUrl;
            expansionIconUrlSpy.and.returnValue(expected);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(MatCardAvatar)).properties.src;

            expect(actual).toBe(expected);
        });

        it('should bind content of MatCardTitle correctly', () => {
            const card = dataFixture.createCard();
            component.card = card;
            const expected = `${card.name} (${card.cost})`;
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(MatCardTitle)).properties
                .innerText;

            expect(actual).toBe(expected);
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
