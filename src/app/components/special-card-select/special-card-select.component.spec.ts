import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, FormGroupDirective } from '@angular/forms';
import { SpecialCardsAvailability } from 'src/app/models/special-cards-availability';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSliderHarness, MatSliderThumbHarness } from '@angular/material/slider/testing';

import { SpecialCardSelectComponent } from './special-card-select.component';
import { By } from '@angular/platform-browser';
import { DataFixture } from 'src/testing/data-fixture';

describe('SpecialCardSelectComponent', () => {
    let component: SpecialCardSelectComponent;
    let fixture: ComponentFixture<SpecialCardSelectComponent>;
    let harnessLoader: HarnessLoader;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SpecialCardSelectComponent],
            providers: [
                {
                    provide: ConfigurationService,
                    useValue: jasmine.createSpyObj<ConfigurationService>('ConfigurationService', [
                        'updateSpecialCardsCount',
                    ]),
                },
                UntypedFormBuilder,
            ],
        });

        dataFixture = new DataFixture();

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
            expect(actual.contains('traits')).withContext('traits').toBeTrue();
        });

        it('should have correct initial value', () => {
            const expected = dataFixture.createSpecialCardsCount();
            component.initialValue = expected;
            fixture.detectChanges();

            const actual = component.formGroup.value;

            expect(actual).toEqual(expected);
        });

        it('with value changes should emit valueChange event correctly', () => {
            fixture.detectChanges();
            component.availability = {
                events: true,
                landmarks: true,
                projects: true,
                ways: true,
                traits: true,
            };
            const expected = dataFixture.createSpecialCardsCount();
            const emitSpy = spyOn(component.valueChange, 'emit');

            component.formGroup.setValue(expected);

            expect(emitSpy).toHaveBeenCalledWith(expected);
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
            'traits',
        ];
        specialCards.forEach((specialCards) => {
            it(`with ${specialCards} are available should render corresponding slider correctly`, async () => {
                const availability: SpecialCardsAvailability = {
                    events: false,
                    landmarks: false,
                    projects: false,
                    ways: false,
                    traits: false,
                };
                availability[specialCards] = true;
                component.availability = availability;

                const matSlider = await harnessLoader.getHarness(MatSliderHarness);
                const matSliderThumb = await harnessLoader.getHarness(MatSliderThumbHarness);

                expect(await matSlider.getMinValue())
                    .withContext('minValue')
                    .toBe(0);
                expect(await matSlider.getMaxValue())
                    .withContext('maxValue')
                    .toBe(5);
                expect(await matSlider.getStep())
                    .withContext('step')
                    .toBe(1);
                expect(await (await matSliderThumb.host()).getAttribute('formControlName'))
                    .withContext('formControlName')
                    .toBe(specialCards);
            });

            it(`with ${specialCards} are available should render corresponding label correctly`, () => {
                const availability: SpecialCardsAvailability = {
                    events: false,
                    landmarks: false,
                    projects: false,
                    ways: false,
                    traits: false,
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
                    traits: false,
                };
                availability[specialCards] = true;
                component.availability = availability;
                const expected = 1;
                await (await harnessLoader.getHarness(MatSliderThumbHarness)).setValue(expected);

                const actual = Number.parseInt(
                    fixture.debugElement.query(By.css('.special-cards-label span')).properties
                        .innerText as string,
                );

                expect(actual).toBe(expected);
            });
        });
    });
});
