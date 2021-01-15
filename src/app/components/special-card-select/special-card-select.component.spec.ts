import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { Options } from 'src/app/models/options';
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

describe('SpecialCardSelectComponent', () => {
    let component: SpecialCardSelectComponent;
    let fixture: ComponentFixture<SpecialCardSelectComponent>;
    let harnessLoader: HarnessLoader;
    let configurationServiceSpy: SpyObj<ConfigurationService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatSliderModule, MatButtonModule],
            declarations: [SpecialCardSelectComponent],
            providers: [
                {
                    provide: ConfigurationService,
                    useValue: jasmine.createSpyObj<ConfigurationService>('ConfigurationService', [
                        'updateOptions',
                    ]),
                },
                FormBuilder,
            ],
        });

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

            expect(actual.contains('events')).toBeTrue();
            expect(actual.contains('landmarks')).toBeTrue();
            expect(actual.contains('projects')).toBeTrue();
            expect(actual.contains('ways')).toBeTrue();
        });

        it('should have correct start value', () => {
            fixture.detectChanges();
            const expected: Options = { events: 0, landmarks: 0, projects: 0, ways: 0 };

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
            const count: Options = { events: 1, landmarks: 1, projects: 1, ways: 1 };

            component.formGroup.setValue(count);

            expect(configurationServiceSpy.updateOptions).toHaveBeenCalledWith(count);
        });

        it('with not all special cards are available and special cards count change should update configuration correctly', () => {
            fixture.detectChanges();
            component.availability = {
                events: true,
                landmarks: true,
                projects: false,
                ways: false,
            };
            const count: Options = { events: 1, landmarks: 1, projects: 1, ways: 1 };
            const expected: Options = { events: 1, landmarks: 1, projects: 0, ways: 0 };

            component.formGroup.setValue(count);

            expect(configurationServiceSpy.updateOptions).toHaveBeenCalledWith(expected);
        });
    });

    describe('ngOnChanges', () => {
        it('with specialCardsAvailability changes should update configuration correctly', () => {
            fixture.detectChanges();
            const count: Options = { events: 1, landmarks: 1, projects: 1, ways: 1 };
            component.formGroup.setValue(count);
            const availability = {
                events: true,
                landmarks: true,
                projects: false,
                ways: false,
            };
            const expected: Options = { events: 1, landmarks: 1, projects: 0, ways: 0 };

            component.ngOnChanges({
                specialCardsAvailability: new SimpleChange(
                    component.availability,
                    availability,
                    false,
                ),
            });

            expect(configurationServiceSpy.updateOptions).toHaveBeenCalledWith(expected);
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
