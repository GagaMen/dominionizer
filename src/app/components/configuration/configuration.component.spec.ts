import { when } from 'vitest-when';
import type { Mock } from 'vitest';
import { CardService } from './../../services/card.service';
import { injectSpy, SpyObj } from './../../../testing/spy-obj';
import { AppBarConfiguration } from './../../models/app-bar-configuration';
import { AppBarService } from './../../services/app-bar.service';
import { signal } from '@angular/core';
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
import { SpecialCardsAvailability } from 'src/app/models/special-cards-availability';
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
import { provideRouter, Router } from '@angular/router';
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
            imports: [ConfigurationComponent, NoopAnimationsModule],
            providers: [
                provideRouter([]),
                {
                    provide: AppBarService,
                    useValue: {
                        updateConfiguration: vi.fn(),
                    },
                },
                {
                    provide: EditionService,
                    useValue: {},
                },
                {
                    provide: ConfigurationService,
                    useValue: {
                        isCardTypeAvailable: vi.fn(),
                        updateEditions: vi.fn(),
                        updateSpecialCardsCount: vi.fn(),
                    },
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

        appBarServiceSpy = injectSpy(AppBarService);

        editionServiceSpy = TestBed.inject(EditionService);
        editionServiceSpy.editions = dataFixture.createEditions();

        configurationServiceSpy = injectSpy(ConfigurationService);
        configurationServiceSpy.configuration = signal(dataFixture.createConfiguration());
        configurationServiceSpy.isCardTypeAvailable.mockReturnValue(true);

        cardServiceSpy = injectSpy(CardService);
        cardServiceSpy.cards = new Map<string, Card>(
            dataFixture.createCards().map((card: Card) => [card.id, card]),
        );

        fixture = TestBed.createComponent(ConfigurationComponent);
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
    });

    describe('editionSelectViewData', () => {
        it('should return correct EditionSelectViewData', () => {
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
            editionServiceSpy.editions = editions;
            configurationServiceSpy.configuration = signal(configuration);
            cardServiceSpy.cards = cards;

            const actual = component.editionSelectViewData();

            expect(actual).toEqual(expected);
        });

        it('with editions has no cards should return correct EditionSelectViewData', () => {
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
            editionServiceSpy.editions = [editionWithCards, editionWithoutCards];
            configurationServiceSpy.configuration = signal(configuration);
            cardServiceSpy.cards = cards;

            const actual = component.editionSelectViewData();

            expect(actual).toEqual(expected);
        });
    });

    describe('specialCardSelectViewData', () => {
        it('with special cards are available should return correct SpecialCardSelectViewData', () => {
            const configuration = dataFixture.createConfiguration();
            const availability = dataFixture.createSpecialCardsAvailability({
                events: true,
            });
            const expected: SpecialCardSelectViewData = {
                initialValue: configuration.specialCardsCount,
                availability: availability,
            };
            configurationServiceSpy.configuration = signal(configuration);
            when(configurationServiceSpy.isCardTypeAvailable)
                .calledWith(CardTypeId.Event)
                .thenReturn(availability.events);
            when(configurationServiceSpy.isCardTypeAvailable)
                .calledWith(CardTypeId.Landmark)
                .thenReturn(availability.landmarks);
            when(configurationServiceSpy.isCardTypeAvailable)
                .calledWith(CardTypeId.Project)
                .thenReturn(availability.projects);
            when(configurationServiceSpy.isCardTypeAvailable)
                .calledWith(CardTypeId.Way)
                .thenReturn(availability.ways);
            when(configurationServiceSpy.isCardTypeAvailable)
                .calledWith(CardTypeId.Trait)
                .thenReturn(availability.traits);

            const actual = component.specialCardSelectViewData();

            expect(actual).toEqual(expected);
        });

        it('with no special cards are available should return null', () => {
            configurationServiceSpy.isCardTypeAvailable.mockReturnValue(false);

            const actual = component.specialCardSelectViewData();

            expect(actual).toBeNull();
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
        let routerSpy: Mock;
        let editionSelect: EditionSelectStubComponent;

        beforeEach(() => {
            routerSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
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
            const showValidationErrorSpy = vi
                .spyOn(editionSelect, 'showValidationError')
                .mockReturnValue(undefined);

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

            expect(actual.stepControl, 'stepControl').toBe(editionSelect.formGroup);
            expect(actual.errorMessage, 'errorMessage').toBe('Choose at least one expansion');
        });

        it('should bind properties of EditionSelectComponent correctly', () => {
            const editions = dataFixture.createEditions();
            const initialValue = editions.slice(0, 1);
            editionServiceSpy.editions = editions;
            cardServiceSpy.cards = new Map<string, Card>(
                dataFixture
                    .createCards(3, { editions: editions })
                    .map((card: Card) => [card.id, card]),
            );
            configurationServiceSpy.configuration = signal(
                dataFixture.createConfiguration({ editions: initialValue }),
            );
            fixture.detectChanges();

            const actual = fixture.debugElement
                .query(By.directive(EditionSelectStubComponent))
                .injector.get(EditionSelectStubComponent);

            expect(actual.editions(), 'editions').toEqual(editions);
            expect(actual.initialValue(), 'initialValue').toBe(initialValue);
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

            expect(actual.stepControl, 'stepControl').toBe(specialCardSelect.formGroup);
        });

        it('should bind properties of SpecialCardSelectComponent correctly', () => {
            const initialValue = dataFixture.createSpecialCardsCount();
            const availability: SpecialCardsAvailability = {
                events: true,
                landmarks: false,
                projects: false,
                ways: false,
                traits: false,
            };
            configurationServiceSpy.configuration = signal(
                dataFixture.createConfiguration({ specialCardsCount: initialValue }),
            );
            configurationServiceSpy.isCardTypeAvailable.mockReturnValue(false);
            when(configurationServiceSpy.isCardTypeAvailable)
                .calledWith(CardTypeId.Event)
                .thenReturn(true);
            fixture.detectChanges();

            const actual = fixture.debugElement
                .query(By.directive(SpecialCardSelectStubComponent))
                .injector.get(SpecialCardSelectStubComponent);

            expect(actual.initialValue(), 'initialValue').toBe(initialValue);
            expect(actual.availability(), 'availability').toEqual(availability);
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
            const navigateToSetSpy = vi
                .spyOn(component, 'navigateToSet')
                .mockReturnValue(undefined);
            fixture.detectChanges();
            const button = await harnessLoader.getHarness(
                MatButtonHarness.with({ variant: 'fab' }),
            );

            await button.click();

            expect(navigateToSetSpy).toHaveBeenCalled();
        });
    });
});
