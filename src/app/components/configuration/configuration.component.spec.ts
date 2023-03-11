import { CardService } from './../../services/card.service';
import { SpyObj } from './../../../testing/spy-obj';
import { AppBarConfiguration } from './../../models/app-bar-configuration';
import { AppBarService } from './../../services/app-bar.service';
import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
    ConfigurationComponent,
    ExpansionSelectViewData,
    SpecialCardSelectViewData,
} from './configuration.component';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ExpansionSelectStubComponent } from 'src/testing/components/expansion-select.stub.component';
import { SpecialCardSelectStubComponent } from 'src/testing/components/special-card-select.stub.component';
import { ExpansionService } from 'src/app/services/expansion.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DataFixture } from 'src/testing/data-fixture';
import { CardTypeId } from 'src/app/models/card-type';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
    MatStepHarness,
    MatStepperHarness,
    StepperOrientation,
} from '@angular/material/stepper/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { Card } from 'src/app/models/card';
import { MatIconHarness } from '@angular/material/icon/testing';

describe('ConfigurationComponent', () => {
    let component: ConfigurationComponent;
    let fixture: ComponentFixture<ConfigurationComponent>;
    let harnessLoader: HarnessLoader;
    let appBarServiceSpy: SpyObj<AppBarService>;
    let expansionServiceSpy: SpyObj<ExpansionService>;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let cardServiceSpy: SpyObj<CardService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatStepperModule, MatButtonModule, MatIconModule, NoopAnimationsModule],
            declarations: [
                ConfigurationComponent,
                ExpansionSelectStubComponent,
                SpecialCardSelectStubComponent,
            ],
            providers: [
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj<Router>('Router', ['navigate']),
                },
                {
                    provide: AppBarService,
                    useValue: jasmine.createSpyObj<AppBarService>('AppBarService', [
                        'updateConfiguration',
                    ]),
                },
                {
                    provide: ExpansionService,
                    useValue: {},
                },
                {
                    provide: ConfigurationService,
                    useValue: jasmine.createSpyObj<ConfigurationService>('ConfigurationService', [
                        'isCardTypeAvailable',
                        'updateExpansions',
                        'updateSpecialCardsCount',
                    ]),
                },
                {
                    provide: CardService,
                    useValue: {},
                },
            ],
        });

        dataFixture = new DataFixture();

        appBarServiceSpy = TestBed.inject(AppBarService) as jasmine.SpyObj<AppBarService>;

        expansionServiceSpy = TestBed.inject(ExpansionService) as jasmine.SpyObj<ExpansionService>;
        expansionServiceSpy.expansions$ = of(dataFixture.createExpansions());

        configurationServiceSpy = TestBed.inject(
            ConfigurationService,
        ) as jasmine.SpyObj<ConfigurationService>;
        configurationServiceSpy.configuration$ = of(dataFixture.createConfiguration());
        configurationServiceSpy.isCardTypeAvailable.and.returnValue(of(true));

        cardServiceSpy = TestBed.inject(CardService) as jasmine.SpyObj<CardService>;
        cardServiceSpy.cards$ = of(
            new Map<number, Card>(dataFixture.createCards().map((card: Card) => [card.id, card])),
        );

        fixture = TestBed.createComponent(ConfigurationComponent);
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
    });

    describe('expansionSelectViewData$', () => {
        it('should emit correct ExpansionSelectViewData', () => {
            const expansions = dataFixture.createExpansions();
            const configuration = dataFixture.createConfiguration();
            const cards = new Map<number, Card>(
                dataFixture
                    .createCards(10, { expansions: expansions })
                    .map((card: Card) => [card.id, card]),
            );
            const expected: ExpansionSelectViewData = {
                expansions: expansions,
                initialValue: configuration.expansions,
            };
            const expansions$ = cold('   --a', { a: expansions });
            const configuration$ = cold('--b', { b: configuration });
            const cards$ = cold('        --c', { c: cards });
            const expected$ = cold('     --d', { d: expected });
            expansionServiceSpy.expansions$ = expansions$;
            configurationServiceSpy.configuration$ = configuration$;
            cardServiceSpy.cards$ = cards$;
            fixture.detectChanges();

            const actual$ = component.expansionSelectViewData$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with expansions has no cards should emit correct ExpansionSelectViewData', () => {
            const expansionWithCards = dataFixture.createExpansion({ id: 1 });
            const expansionWithoutCards = dataFixture.createExpansion({ id: 2 });
            const configuration = dataFixture.createConfiguration();
            const cards = new Map<number, Card>(
                dataFixture
                    .createCards(10, { expansions: [expansionWithCards] })
                    .map((card: Card) => [card.id, card]),
            );
            const expected: ExpansionSelectViewData = {
                expansions: [expansionWithCards],
                initialValue: configuration.expansions,
            };
            const expansions$ = cold('   --a', { a: [expansionWithCards, expansionWithoutCards] });
            const configuration$ = cold('--b', { b: configuration });
            const cards$ = cold('        --c', { c: cards });
            const expected$ = cold('     --d', { d: expected });
            expansionServiceSpy.expansions$ = expansions$;
            configurationServiceSpy.configuration$ = configuration$;
            cardServiceSpy.cards$ = cards$;
            fixture.detectChanges();

            const actual$ = component.expansionSelectViewData$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('specialCardSelectViewData$', () => {
        it('with special cards are available should emit correct SpecialCardSelectViewData', () => {
            const configuration = dataFixture.createConfiguration();
            const availability = dataFixture.createSpecialCardsAvailability({
                events: true,
            });
            const expected: SpecialCardSelectViewData = {
                initialValue: configuration.specialCardsCount,
                availability: availability,
            };
            const configuration$ = cold('        --a', { a: configuration });
            const areEventsAvailable$ = cold('   --b', { b: availability.events });
            const areLandmarksAvailable$ = cold('--c', { c: availability.landmarks });
            const areProjectsAvailable$ = cold(' --d', { d: availability.projects });
            const areWaysAvailable$ = cold('     --e', { e: availability.ways });
            const areTraitsAvailable$ = cold('   --f', { f: availability.traits });
            const expected$ = cold('             --g', { g: expected });
            configurationServiceSpy.configuration$ = configuration$;
            configurationServiceSpy.isCardTypeAvailable
                .withArgs(CardTypeId.Event)
                .and.returnValue(areEventsAvailable$);
            configurationServiceSpy.isCardTypeAvailable
                .withArgs(CardTypeId.Landmark)
                .and.returnValue(areLandmarksAvailable$);
            configurationServiceSpy.isCardTypeAvailable
                .withArgs(CardTypeId.Project)
                .and.returnValue(areProjectsAvailable$);
            configurationServiceSpy.isCardTypeAvailable
                .withArgs(CardTypeId.Way)
                .and.returnValue(areWaysAvailable$);
            configurationServiceSpy.isCardTypeAvailable
                .withArgs(CardTypeId.Trait)
                .and.returnValue(areTraitsAvailable$);
            fixture.detectChanges();

            const actual$ = component.specialCardSelectViewData$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with no special cards are available should emit null', () => {
            const configuration = dataFixture.createConfiguration();
            const configuration$ = cold('      --a', { a: configuration });
            const isCardTypeAvailable$ = cold('--b', { b: false });
            const expected$ = cold('           --c', { c: null });
            configurationServiceSpy.configuration$ = configuration$;
            configurationServiceSpy.isCardTypeAvailable.and.returnValue(isCardTypeAvailable$);
            fixture.detectChanges();

            const actual$ = component.specialCardSelectViewData$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('ngOnInit', () => {
        it('should update AppBarConfiguration correctly', () => {
            const configuration: AppBarConfiguration = {
                navigationAction: 'none',
                actions: [],
            };

            fixture.detectChanges();

            expect(appBarServiceSpy.updateConfiguration).toHaveBeenCalledWith(configuration);
        });
    });

    describe('template', () => {
        it('should render vertical stepper', async () => {
            const actual = await harnessLoader.getHarness(
                MatStepperHarness.with({ orientation: StepperOrientation.VERTICAL }),
            );

            expect(actual).toBeInstanceOf(MatStepperHarness);
        });

        it('should render "Expansions" step', async () => {
            const actual = await harnessLoader.getHarness(
                MatStepHarness.with({ label: 'Expansions' }),
            );

            expect(actual).toBeInstanceOf(MatStepHarness);
        });

        it('should bind properties of "Expansions" step correctly', () => {
            fixture.detectChanges();
            const expansionSelect = fixture.debugElement
                .query(By.directive(ExpansionSelectStubComponent))
                .injector.get(ExpansionSelectStubComponent);

            const actual = fixture.debugElement
                .query(By.directive(MatStepper))
                .injector.get(MatStepper).steps.first;

            expect(actual.stepControl).withContext('stepControl').toBe(expansionSelect.formGroup);
            expect(actual.errorMessage)
                .withContext('errorMessage')
                .toBe('Choose at least one expansion');
        });

        it('should bind properties of ExpansionSelectComponent correctly', () => {
            fixture.detectChanges();
            const expansions = dataFixture.createExpansions();
            const initialValue = expansions.slice(0, 1);
            const viewData: ExpansionSelectViewData = {
                expansions: expansions,
                initialValue: initialValue,
            };
            component.expansionSelectViewData$ = of(viewData);
            fixture.detectChanges();

            const actual = fixture.debugElement
                .query(By.directive(ExpansionSelectStubComponent))
                .injector.get(ExpansionSelectStubComponent);

            expect(actual.expansions).withContext('expansions').toBe(expansions);
            expect(actual.initialValue).withContext('initialValue').toBe(initialValue);
        });

        it('should bind change event of ExpansionSelectComponent correctly', () => {
            fixture.detectChanges();
            const expansions = dataFixture.createExpansions();

            const expansionSelect = fixture.debugElement
                .query(By.directive(ExpansionSelectStubComponent))
                .injector.get(ExpansionSelectStubComponent);
            expansionSelect.change.emit(expansions);

            expect(configurationServiceSpy.updateExpansions).toHaveBeenCalledWith(expansions);
        });

        it('should render "Special Cards" step', async () => {
            const actual = await harnessLoader.getHarness(
                MatStepHarness.with({ label: 'Special Cards' }),
            );

            expect(actual).toBeInstanceOf(MatStepHarness);
        });

        it('should bind properties of "Special Cards" step correctly', () => {
            fixture.detectChanges();
            const specialCardSelect = fixture.debugElement
                .query(By.directive(SpecialCardSelectStubComponent))
                .injector.get(SpecialCardSelectStubComponent);

            const actual = fixture.debugElement
                .query(By.directive(MatStepper))
                .injector.get(MatStepper).steps.last;

            expect(actual.stepControl).withContext('stepControl').toBe(specialCardSelect.formGroup);
        });

        it('should bind properties of SpecialCardSelectComponent correctly', () => {
            fixture.detectChanges();
            const initialValue = dataFixture.createSpecialCardsCount();
            const availability = dataFixture.createSpecialCardsAvailability();
            const viewData: SpecialCardSelectViewData = {
                initialValue: initialValue,
                availability: availability,
            };
            component.specialCardSelectViewData$ = of(viewData);
            fixture.detectChanges();

            const actual = fixture.debugElement
                .query(By.directive(SpecialCardSelectStubComponent))
                .injector.get(SpecialCardSelectStubComponent);

            expect(actual.initialValue).withContext('initialValue').toBe(initialValue);
            expect(actual.availability).withContext('availability').toBe(availability);
        });

        it('should bind valueChange event of SpecialCardSelectComponent correctly', () => {
            fixture.detectChanges();
            const count = dataFixture.createSpecialCardsCount();

            const specialCardSelectComponent = fixture.debugElement
                .query(By.directive(SpecialCardSelectStubComponent))
                .injector.get(SpecialCardSelectStubComponent);
            specialCardSelectComponent.valueChange.emit(count);

            expect(configurationServiceSpy.updateSpecialCardsCount).toHaveBeenCalledWith(count);
        });

        it('should render shuffle button correctly', async () => {
            const actual = await harnessLoader.getHarness(
                MatButtonHarness.with({ variant: 'fab' }),
            );
            const actualHost = await actual.host();
            const actualIcon = await actual.getHarness(MatIconHarness.with({ name: 'casino' }));

            expect(actual).toBeInstanceOf(MatButtonHarness);
            expect(await actualHost.getAttribute('extended')).toBeDefined();
            expect(await actualHost.getAttribute('routerLink')).toBe('/set');
            expect(actualIcon).toBeInstanceOf(MatIconHarness);
            expect(await actual.getText()).toBe('casino' + 'generate');
        });
    });
});
