import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { SpecialCardsCount } from 'src/app/models/special-cards-count';
import { SpecialCardsAvailability } from 'src/app/models/special-cards-availability';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { SpyObj } from 'src/testing/spy-obj';
import { MatSliderHarness } from '@angular/material/slider/testing';

import { SpecialCardSelectComponent } from './special-card-select.component';
import { MatSliderModule } from '@angular/material/slider';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { SimpleChange } from '@angular/core';
import { DataFixture } from 'src/testing/data-fixture';

describe('SpecialCardSelectComponent', () => {
    let component: SpecialCardSelectComponent;
    let fixture: ComponentFixture<SpecialCardSelectComponent>;
    let harnessLoader: HarnessLoader;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatSliderModule, MatButtonModule],
            declarations: [SpecialCardSelectComponent],
            providers: [
                {
                    provide: ConfigurationService,
                    useValue: jasmine.createSpyObj<ConfigurationService>('ConfigurationService', [
                        'updateSpecialCardsCount',
                    ]),
                },
                FormBuilder,
            ],
        });

        dataFixture = new DataFixture();

        configurationServiceSpy = TestBed.inject(ConfigurationService) as jasmine.SpyObj<
            ConfigurationService
        >;

        fixture = TestBed.createComponent(SpecialCardSelectComponent);
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
    });

    describe('formGroup', () => {
        it('should have correct FormControls', () => {
            fixture.detectChanges();

            const actual = component.formGroup;

            expect(actual.contains('events')).withContext('events').toBeTrue();
            expect(actual.contains('landmarks')).withContext('landmarks').toBeTrue();
            expect(actual.contains('projects')).withContext('projects').toBeTrue();
            expect(actual.contains('ways')).withContext('ways').toBeTrue();
        });

        it('should have correct initial value', () => {
            const expected = dataFixture.createSpecialCardsCount();
            component.initialValue = expected;
            fixture.detectChanges();

            const actual = component.formGroup.value;

            expect(actual).toEqual(expected);
        });

        it('with all special cards are available and special cards count change should update configuration correctly', () => {
            fixture.detectChanges();
            component.availability = {
                events: true,
                landmarks: true,
                projects: true,
                ways: true,
            };
            const expected = dataFixture.createSpecialCardsCount();

            component.formGroup.setValue(expected);

            expect(configurationServiceSpy.updateSpecialCardsCount).toHaveBeenCalledWith(expected);
        });

        it('with not all special cards are available and special cards count change should update configuration correctly', () => {
            fixture.detectChanges();
            component.availability = {
                events: true,
                landmarks: true,
                projects: false,
                ways: false,
            };
            const count = dataFixture.createSpecialCardsCount();
            const expected: SpecialCardsCount = { ...count, projects: 0, ways: 0 };

            component.formGroup.setValue(count);

            expect(configurationServiceSpy.updateSpecialCardsCount).toHaveBeenCalledWith(expected);
        });
    });

    describe('ngOnChanges', () => {
        it('with specialCardsAvailability changes should update configuration correctly', () => {
            fixture.detectChanges();
            const count = dataFixture.createSpecialCardsCount();
            component.formGroup.setValue(count);
            const availability: SpecialCardsAvailability = {
                events: true,
                landmarks: true,
                projects: false,
                ways: false,
            };
            const expected: SpecialCardsCount = { ...count, projects: 0, ways: 0 };

            component.ngOnChanges({
                specialCardsAvailability: new SimpleChange(
                    component.availability,
                    availability,
                    false,
                ),
            });

            expect(configurationServiceSpy.updateSpecialCardsCount).toHaveBeenCalledWith(expected);
        });
    });

    describe('template', () => {
        it('should bind formGroup correctly', () => {
            fixture.detectChanges();
            const expected = component.formGroup;

            const actual = fixture.debugElement
                .query(By.css('form'))
                .injector.get(FormGroupDirective).form;

            expect(actual).toBe(expected);
        });

        const specialCards: (keyof SpecialCardsAvailability)[] = [
            'events',
            'landmarks',
            'projects',
            'ways',
        ];
        specialCards.forEach((specialCards) => {
            it(`with ${specialCards} are available should render corresponding slider correctly`, async () => {
                const availability: SpecialCardsAvailability = {
                    events: false,
                    landmarks: false,
                    projects: false,
                    ways: false,
                };
                availability[specialCards] = true;
                component.availability = availability;

                const matSlider = await harnessLoader.getHarness(MatSliderHarness);

                expect(await (await matSlider.host()).getAttribute('formControlName'))
                    .withContext('formControlName')
                    .toBe(specialCards);
                expect(await matSlider.getMinValue())
                    .withContext('minValue')
                    .toBe(0);
                expect(await matSlider.getMaxValue())
                    .withContext('maxValue')
                    .toBe(5);
            });

            it(`with ${specialCards} are available should render corresponding label correctly`, () => {
                const availability: SpecialCardsAvailability = {
                    events: false,
                    landmarks: false,
                    projects: false,
                    ways: false,
                };
                availability[specialCards] = true;
                component.availability = availability;
                const expected =
                    specialCards.substring(0, 1).toUpperCase() + specialCards.substring(1);
                fixture.detectChanges();

                const actual = fixture.debugElement.query(By.css('.special-cards-label label'))
                    .properties.innerText;

                expect(actual).toBe(expected);
            });

            it(`with ${specialCards} are available should render corresponding value correctly`, async () => {
                const availability: SpecialCardsAvailability = {
                    events: false,
                    landmarks: false,
                    projects: false,
                    ways: false,
                };
                availability[specialCards] = true;
                component.availability = availability;
                const expected = 1;
                await (await harnessLoader.getHarness(MatSliderHarness)).setValue(expected);

                const actual = Number.parseInt(
                    fixture.debugElement.query(By.css('.special-cards-label span')).properties
                        .innerText,
                );

                expect(actual).toBe(expected);
            });
        });

        it('should bind back button correctly', () => {
            const matButton = harnessLoader.getHarness(
                MatButtonHarness.with({ selector: '[matStepperPrevious]' }),
            );

            expect(matButton).not.toBeNull();
        });
    });
});
