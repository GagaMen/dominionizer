import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionSelectComponent } from './expansion-select.component';
import { ConfigurationService } from '../../services/configuration.service';
import {
    FormBuilder,
    ReactiveFormsModule,
    FormArray,
    FormControl,
    FormControlName,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Expansion } from '../../models/expansion';
import { SpyObj } from 'src/testing/spy-obj';
import { DataFixture } from 'src/testing/data-fixture';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';

describe('ExpansionSelectComponent', () => {
    let component: ExpansionSelectComponent;
    let fixture: ComponentFixture<ExpansionSelectComponent>;
    let harnessLoader: HarnessLoader;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let dataFixture: DataFixture;
    let expansions: Expansion[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatDividerModule, MatCheckboxModule],
            declarations: [ExpansionSelectComponent],
            providers: [
                {
                    provide: ConfigurationService,
                    useValue: jasmine.createSpyObj<ConfigurationService>('ConfigurationService', [
                        'updateExpansions',
                    ]),
                },
                FormBuilder,
            ],
        });

        dataFixture = new DataFixture();
        expansions = dataFixture.createExpansions();

        configurationServiceSpy = TestBed.inject(ConfigurationService) as jasmine.SpyObj<
            ConfigurationService
        >;

        fixture = TestBed.createComponent(ExpansionSelectComponent);
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;

        component.expansions = expansions;
    });

    describe('expansions', () => {
        it('should return expansions ordered by name', () => {
            const firstExpansion = dataFixture.createExpansion({ name: 'a' });
            const secondExpansion = dataFixture.createExpansion({ name: 'b' });
            const input = [secondExpansion, firstExpansion];
            const expected = [firstExpansion, secondExpansion];
            component.expansions = input;

            const actual = component.expansions;

            expect(actual).toEqual(expected);
        });
    });

    describe('formGroup', () => {
        it('should have "all"-FormControl', () => {
            fixture.detectChanges();

            const actual = component.formGroup.get('all');

            expect(actual).toBeInstanceOf(FormControl);
        });

        it('should have "expansions"-FormArray', () => {
            fixture.detectChanges();

            const actual = component.formGroup.get('expansions');

            expect(actual).toBeInstanceOf(FormArray);
        });

        it('should have FormControl per expansion inside the "expansions"-FormArray', () => {
            fixture.detectChanges();
            const expected = jasmine.arrayWithExactContents(
                expansions.map(() => jasmine.any(FormControl)),
            );

            const actual = (component.formGroup.get('expansions') as FormArray).controls;

            expect(actual).toEqual(expected);
        });

        it('should have "all"-FormControl unchecked after initialization', () => {
            fixture.detectChanges();

            const actual = component.formGroup.value.all;

            expect(actual).toBeFalse();
        });

        it('should have all expansions unselected after initialization', () => {
            fixture.detectChanges();
            const expected = expansions.map(() => false);

            const actual = component.formGroup.value.expansions;

            expect(actual).toEqual(expected);
        });

        it('with no selected expansion should be invalid', () => {
            fixture.detectChanges();

            const actual = component.formGroup.invalid;

            expect(actual).toBeTrue();
        });

        it('with selected expansions change should update configuration', () => {
            fixture.detectChanges();
            const selectedExpansions = expansions.slice(0, 1);
            const expansionsPatch: boolean[] = expansions.map(() => false);
            expansionsPatch[0] = true;

            component.formGroup.patchValue({ expansions: expansionsPatch });

            expect(configurationServiceSpy.updateExpansions).toHaveBeenCalledWith(
                selectedExpansions,
            );
        });
    });

    describe('areSomeButNotAllSelected', () => {
        it('with at least one but not all expansions are selected should return true', () => {
            fixture.detectChanges();
            const expansionsPatch: boolean[] = expansions.map(() => false);
            expansionsPatch[0] = true;
            component.formGroup.patchValue({ expansions: expansionsPatch });

            const actual = component.areSomeButNotAllSelected();

            expect(actual).toBeTrue();
        });

        it('with no expansion is selected should return false', () => {
            fixture.detectChanges();
            const expansionsPatch: boolean[] = expansions.map(() => false);
            component.formGroup.patchValue({ expansions: expansionsPatch });

            const actual = component.areSomeButNotAllSelected();

            expect(actual).toBeFalse();
        });

        it('with all expansion are selected should return false', () => {
            fixture.detectChanges();
            const expansionsPatch: boolean[] = expansions.map(() => true);
            component.formGroup.patchValue({ expansions: expansionsPatch });

            const actual = component.areSomeButNotAllSelected();

            expect(actual).toBeFalse();
        });
    });

    describe('areAllSelected', () => {
        it('with all expansions are selected should return true', () => {
            fixture.detectChanges();
            const expansionsPatch: boolean[] = expansions.map(() => true);
            component.formGroup.patchValue({ expansions: expansionsPatch });

            const actual = component.areAllSelected();

            expect(actual).toBeTrue();
        });

        it('with not all expansions are selected should return false', () => {
            fixture.detectChanges();
            const expansionsPatch: boolean[] = expansions.map(() => true);
            expansionsPatch[0] = false;
            component.formGroup.patchValue({ expansions: expansionsPatch });

            const actual = component.areAllSelected();

            expect(actual).toBeFalse();
        });
    });

    describe('selectOrDeselectAll', () => {
        it('with checked is true should select all expansions', () => {
            fixture.detectChanges();
            const checked = true;
            const expected = expansions.map(() => checked);

            component.selectOrDeselectAll(checked);
            const actual: boolean[] = component.formGroup.value.expansions;

            expect(actual).toEqual(expected);
        });

        it('with checked is false should deselect all expansions', () => {
            fixture.detectChanges();
            const checked = false;
            const expected = expansions.map(() => checked);

            component.selectOrDeselectAll(checked);
            const actual: boolean[] = component.formGroup.value.expansions;

            expect(actual).toEqual(expected);
        });
    });

    describe('template', () => {
        it('should render checkbox for "all"-FormControl correctly', async () => {
            fixture.detectChanges();
            const matCheckbox = await harnessLoader.getHarness(MatCheckboxHarness);

            const actual = await matCheckbox.getLabelText();

            expect(actual).toBe('All');
        });

        it('should bind checkbox to "all"-FormControl correctly', () => {
            fixture.detectChanges();

            const actual = fixture.debugElement.query(
                By.css('mat-checkbox[formControlName="all"]'),
            );

            expect(actual).not.toBeNull();
        });

        it('should bind "checked" input property of "all" checkbox correctly', async () => {
            fixture.detectChanges();
            const expected = true;
            spyOn(component, 'areAllSelected').and.returnValue(expected);
            const matCheckbox = await harnessLoader.getHarness(MatCheckboxHarness);

            const actual = await matCheckbox.isChecked();

            expect(actual).toBe(expected);
        });

        it('should bind "indeterminate" input property of "all" checkbox correctly', async () => {
            fixture.detectChanges();
            const expected = true;
            spyOn(component, 'areSomeButNotAllSelected').and.returnValue(expected);
            const matCheckbox = await harnessLoader.getHarness(MatCheckboxHarness);

            const actual = await matCheckbox.isIndeterminate();

            expect(actual).toBe(expected);
        });

        it('should bind "change" output property of "all" checkbox correctly', async () => {
            fixture.detectChanges();
            const selectOrDeselectAllSpy = spyOn(component, 'selectOrDeselectAll');
            const matCheckbox = await harnessLoader.getHarness(MatCheckboxHarness);

            await matCheckbox.check();

            expect(selectOrDeselectAllSpy).toHaveBeenCalledWith(true);
        });

        it('should bind ul element to "expansions"-FormArray', () => {
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('ul[formArrayName="expansions"]'));

            expect(actual).not.toBeNull();
        });

        it('should render checkbox inside li element for each expansion correctly', async () => {
            fixture.detectChanges();

            const actual = await harnessLoader.getAllHarnesses(
                MatCheckboxHarness.with({ ancestor: 'li' }),
            );

            expect(actual).toHaveSize(expansions.length);
            for (let index = 0; index < actual.length; index++) {
                expect(await actual[index].getLabelText()).toBe(expansions[index].name);
            }
        });

        it('should bind checkbox for each expansion correctly', () => {
            fixture.detectChanges();

            const actual = fixture.debugElement
                .queryAll(By.css('li'))
                .map((element) =>
                    element.query(By.directive(MatCheckbox)).injector.get(FormControlName),
                );

            expect(actual).toHaveSize(expansions.length);
            for (let index = 0; index < actual.length; index++) {
                expect(actual[index].name).toBe(index);
            }
        });

        it('should bind forward button correctly', () => {
            fixture.detectChanges();

            const matButton = harnessLoader.getHarness(
                MatButtonHarness.with({ selector: '[matStepperNext]' }),
            );

            expect(matButton).not.toBeNull();
        });
    });
});
