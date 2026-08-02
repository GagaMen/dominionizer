import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardListComponent } from './card-list.component';
import { ShuffleService } from 'src/app/services/shuffle.service';
import { SpyObj } from 'src/testing/spy-obj';
import { DataFixture } from 'src/testing/data-fixture';
import { By } from '@angular/platform-browser';
import { CardComponent } from '../card/card.component';
import { DebugElement } from '@angular/core';
import { Card } from 'src/app/models/card';
import { CardStubComponent } from 'src/testing/components/card.stub.component';

describe('CardListComponent', () => {
    let component: CardListComponent;
    let fixture: ComponentFixture<CardListComponent>;
    let shuffleServiceSpy: SpyObj<ShuffleService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CardListComponent],
            providers: [
                {
                    provide: ShuffleService,
                    useValue: jasmine.createSpyObj<ShuffleService>('ShuffleService', [
                        'shuffleSingleCard',
                    ]),
                },
            ],
        }).overrideComponent(CardComponent, {
            remove: { imports: [CardComponent] },
            add: { imports: [CardStubComponent] },
        });

        dataFixture = new DataFixture();

        shuffleServiceSpy = TestBed.inject(ShuffleService) as jasmine.SpyObj<ShuffleService>;

        fixture = TestBed.createComponent(CardListComponent);
        component = fixture.componentInstance;
    });

    describe('onReshuffle', () => {
        it('should shuffle given card', () => {
            const card = dataFixture.createCard();

            component.onReshuffle(card);

            expect(shuffleServiceSpy.shuffleSingleCard).toHaveBeenCalledWith(card);
        });
    });

    describe('template', () => {
        it('should render CardComponent for each card in card list with corresponding card', () => {
            const expected = dataFixture.createCards();
            component.cardList = expected;

            fixture.detectChanges();
            const actual = fixture.debugElement
                .queryAll(By.directive(CardComponent))
                .map((cardComponent: DebugElement) => cardComponent.componentInstance.card as Card);

            expect(actual).toEqual(expected);
        });

        it('should not re-create the dom of cards that keep their id', () => {
            const cards = dataFixture.createCards();
            component.cardList = cards;
            fixture.detectChanges();
            const expected = fixture.debugElement
                .queryAll(By.directive(CardComponent))
                .map((cardComponent: DebugElement) => cardComponent.nativeElement as HTMLElement);

            // same cards by id, but fresh object references as an immutable update would produce
            component.cardList = cards.map((card: Card) => ({ ...card }));
            fixture.detectChanges();
            const actual = fixture.debugElement
                .queryAll(By.directive(CardComponent))
                .map((cardComponent: DebugElement) => cardComponent.nativeElement as HTMLElement);

            expect(actual.length).toBe(expected.length);
            // toBe per element: toEqual would compare the dom structurally and pass
            // even for freshly created elements
            actual.forEach((element: HTMLElement, index: number) =>
                expect(element).toBe(expected[index]),
            );
        });

        it('should bind reshuffle event of CardComponent to corresponding event handler', () => {
            const card = dataFixture.createCard();
            component.cardList = [card];
            fixture.detectChanges();
            const cardComponent: CardComponent = fixture.debugElement.query(
                By.directive(CardComponent),
            ).componentInstance;
            const onReshuffleSpy = spyOn(component, 'onReshuffle');

            cardComponent.reshuffle.emit();

            expect(onReshuffleSpy).toHaveBeenCalledWith(card);
        });
    });
});
