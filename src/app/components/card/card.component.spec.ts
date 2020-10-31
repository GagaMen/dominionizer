import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import {
    MatCardModule,
    MatCardAvatar,
    MatCardTitle,
    MatCardSubtitle,
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

    describe('template', () => {
        let expansionIconUrlSpy: jasmine.Spy;

        beforeEach(() => {
            expansionIconUrlSpy = spyOnProperty(component, 'expansionIconUrl');
            expansionIconUrlSpy.and.returnValue(expansionIconUrl);
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
