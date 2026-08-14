import { CardService } from './../../services/card.service';
import { SpyObj } from './../../../testing/spy-obj';
import { AppBarConfiguration } from './../../models/app-bar-configuration';
import { AppBarService } from './../../services/app-bar.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
    ConfigurationComponent,
    EditionSelectViewData,
    SpecialCardSelectViewData,
} from './configuration.component';
import { MatStepper } from '@angular/material/stepper';
import { EditionSelectStubComponent } from 'src/testing/components/edition-select.stub.component';
import { SpecialCardSelectStubComponent } from 'src/testing/components/special-card-select.stub.component';
import { EditionService } from 'src/app/services/edition.service';
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
import { MatButtonHarness } from '@angular/material/button/testing';
import { Card } from 'src/app/models/card';
import { MatIconHarness } from '@angular/material/icon/testing';
import { EditionSelectComponent } from '../edition-select/edition-select.component';
import { SpecialCardSelectComponent } from '../special-card-select/special-card-select.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UntypedFormGroup } from '@angular/forms';

describe('ConfigurationComponent', () => {
    let component: ConfigurationComponent;
    let fixture: ComponentFixture<ConfigurationComponent>;
    let harnessLoader: HarnessLoader;
    let appBarServiceSpy: SpyObj<AppBarService>;
    let editionServiceSpy: SpyObj<EditionService>;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let cardServiceSpy: SpyObj<CardService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ConfigurationComponent, RouterTestingModule, NoopAnimationsModule],
            providers: [
                {
                    provide: AppBarService,
                    useValue: jasmine.createSpyObj<AppBarService>('AppBarService', [
                        'updateConfiguration',
                    ]),
                },
                {
                    provide: EditionService,
                    useValue: {},
                },
                {
                    provide: ConfigurationService,
                    useValue: jasmine.createSpyObj<ConfigurationService>('ConfigurationService', [
                        'isCardTypeAvailable',
                        'updateEditions',
                        'updateSpecialCardsCount',
                    ]),
                },
                {
                    provide: CardService,
                    useValue: {},
                },
            ],
        }).overrideComponent(ConfigurationComponent, {
            remove: { imports: [EditionSelectComponent, SpecialCardSelectComponent] },
            add: { imports: [EditionSelectStubComponent, SpecialCardSelectStubComponent] },
        });

        dataFixture = new DataFixture();

        appBarServiceSpy = TestBed.inject(AppBarService) as jasmine.SpyObj<AppBarService>;

        editionServiceSpy = TestBed.inject(EditionService) as jasmine.SpyObj<EditionService>;
        editionServiceSpy.editions$ = of(dataFixture.createEditions());

        configurationServiceSpy = TestBed.inject(
            ConfigurationService,
        ) as jasmine.SpyObj<ConfigurationService>;
        configurationServiceSpy.configuration$ = of(dataFixture.createConfiguration());
        configurationServiceSpy.isCardTypeAvailable.and.returnValue(of(true));

        cardServiceSpy = TestBed.inject(CardService) as jasmine.SpyObj<CardService>;
        cardServiceSpy.cards$ = of(
            new Map<string, Card>(dataFixture.createCards().map((card: Card) => [card.id, card])),
        );

        fixture = TestBed.createComponent(ConfigurationComponent);
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
    });

    describe('editionSelectViewData$', () => {
        it('should emit correct EditionSelectViewData', () => {
            const editions = dataFixture.createEditions();
            const configuration = dataFixture.createConfiguration();
            const cards = new Map<string, Card>(
                dataFixture
                    .createCards(10, { editions: editions })
                    .map((card: Card) => [card.id, card]),
            );
            const expected: EditionSelectViewData = {
                editions: editions,
                initialValue: configuration.editions,
            };
            const editions$ = cold('   --a', { a: editions });
            const configuration$ = cold('--b', { b: configuration });
            const cards$ = cold('        --c', { c: cards });
            const expected$ = cold('     --d', { d: expected });
            editionServiceSpy.editions$ = editions$;
            configurationServiceSpy.configuration$ = configuration$;
            cardServiceSpy.cards$ = cards$;
            fixture.detectChanges();

            const actual$ = component.editionSelectViewData$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with editions has no cards should emit correct EditionSelectViewData', () => {
            const editionWithCards = dataFixture.createEdition({ id: '1' });
            const editionWithoutCards = dataFixture.createEdition({ id: '2' });
            const configuration = dataFixture.createConfiguration();
            const cards = new Map<string, Card>(
                dataFixture
                    .createCards(10, { editions: [editionWithCards] })
                    .map((card: Card) => [card.id, card]),
            );
            const expected: EditionSelectViewData = {
                editions: [editionWithCards],
                initialValue: configuration.editions,
            };
            const editions$ = cold('   --a', { a: [editionWithCards, editionWithoutCards] });
            const configuration$ = cold('--b', { b: configuration });
            const cards$ = cold('        --c', { c: cards });
            const expected$ = cold('     --d', { d: expected });
            editionServiceSpy.editions$ = editions$;
            configurationServiceSpy.configuration$ = configuration$;
            cardServiceSpy.cards$ = cards$;
            fixture.detectChanges();

            const actual$ = component.editionSelectViewData$;

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

    describe('navigateToSet', () => {
        let routerSpy: jasmine.Spy;
        let editionSelect: EditionSelectStubComponent;

        beforeEach(() => {
            routerSpy = spyOn(TestBed.inject(Router), 'navigate');
            fixture.detectChanges();
            editionSelect = fixture.debugElement
                .query(By.directive(EditionSelectStubComponent))
                .injector.get(EditionSelectStubComponent);
        });

        it('with valid form group of EditionSelectComponent should navigate to set page', () => {
            editionSelect.formGroup = new UntypedFormGroup({});

            component.navigateToSet();

            expect(routerSpy).toHaveBeenCalledWith(['/set']);
        });

        it('with invalid form group of EditionSelectComponent should not navigate', () => {
            editionSelect.formGroup = new UntypedFormGroup({}, () => ({ minSelect: true }));

            component.navigateToSet();

            expect(routerSpy).not.toHaveBeenCalled();
        });

        it('with invalid form group of EditionSelectComponent should show validation error', () => {
            editionSelect.formGroup = new UntypedFormGroup({}, () => ({ minSelect: true }));
            const showValidationErrorSpy = spyOn(editionSelect, 'showValidationError');

            component.navigateToSet();

            expect(showValidationErrorSpy).toHaveBeenCalled();
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
            const editionSelect = fixture.debugElement
                .query(By.directive(EditionSelectStubComponent))
                .injector.get(EditionSelectStubComponent);

            const actual = fixture.debugElement
                .query(By.directive(MatStepper))
                .injector.get(MatStepper).steps.first;

            expect(actual.stepControl).withContext('stepControl').toBe(editionSelect.formGroup);
            expect(actual.errorMessage)
                .withContext('errorMessage')
                .toBe('Choose at least one expansion');
        });

        it('should bind properties of EditionSelectComponent correctly', () => {
            fixture.detectChanges();
            const editions = dataFixture.createEditions();
            const initialValue = editions.slice(0, 1);
            const viewData: EditionSelectViewData = {
                editions: editions,
                initialValue: initialValue,
            };
            component.editionSelectViewData$ = of(viewData);
            fixture.detectChanges();

            const actual = fixture.debugElement
                .query(By.directive(EditionSelectStubComponent))
                .injector.get(EditionSelectStubComponent);

            expect(actual.editions).withContext('editions').toBe(editions);
            expect(actual.initialValue).withContext('initialValue').toBe(initialValue);
        });

        it('should bind change event of EditionSelectComponent correctly', () => {
            fixture.detectChanges();
            const editions = dataFixture.createEditions();

            const editionSelect = fixture.debugElement
                .query(By.directive(EditionSelectStubComponent))
                .injector.get(EditionSelectStubComponent);
            editionSelect.change.emit(editions);

            expect(configurationServiceSpy.updateEditions).toHaveBeenCalledWith(editions);
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
            expect(actualIcon).toBeInstanceOf(MatIconHarness);
            expect(await actual.getText()).toBe('casino' + 'generate');
        });

        it('should bind click event of shuffle button correctly', async () => {
            const navigateToSetSpy = spyOn(component, 'navigateToSet');
            fixture.detectChanges();
            const button = await harnessLoader.getHarness(
                MatButtonHarness.with({ variant: 'fab' }),
            );

            await button.click();

            expect(navigateToSetSpy).toHaveBeenCalled();
        });
    });
});
