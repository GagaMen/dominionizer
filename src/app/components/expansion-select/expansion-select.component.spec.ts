import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionSelectComponent } from './expansion-select.component';
import {
    FormBuilder,
    ReactiveFormsModule,
    FormArray,
    FormControl,
    FormControlName,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Expansion } from '../../models/expansion';
import { DataFixture } from 'src/testing/data-fixture';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { Chance } from 'chance';

describe('ExpansionSelectComponent', () => {
    let component: ExpansionSelectComponent;
    let fixture: ComponentFixture<ExpansionSelectComponent>;
    let harnessLoader: HarnessLoader;
    let dataFixture: DataFixture;
    let chance: Chance.Chance;
    let expansions: Expansion[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatDividerModule, MatCheckboxModule],
            declarations: [ExpansionSelectComponent],
            providers: [FormBuilder],
        });

        dataFixture = new DataFixture();
        chance = new Chance();
        expansions = dataFixture.createExpansions();

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

        it('with initialValue contains not all expansions should have correct initial value', () => {
            const selectedExpansions = chance.pickset(
                component.expansions,
                chance.integer({ min: 0, max: component.expansions.length - 1 }),
            );
            const expansionsState = component.expansions.map((expansion: Expansion) =>
                selectedExpansions.includes(expansion),
            );
            const expected = { all: false, expansions: expansionsState };
            component.initialValue = selectedExpansions;
            fixture.detectChanges();

            const actual = component.formGroup.value;

            expect(actual).toEqual(expected);
        });

        it('with initialValue contains all expansions should have correct initial value', () => {
            const expansionState = component.expansions.map(() => true);
            const expected = { all: true, expansions: expansionState };
            component.initialValue = component.expansions;
            fixture.detectChanges();

            const actual = component.formGroup.value;

            expect(actual).toEqual(expected);
        });

        it('with no selected expansion should be invalid', () => {
            fixture.detectChanges();

            const actual = component.formGroup.invalid;

            expect(actual).toBeTrue();
        });

        it('with selected expansions change should emit change event correctly', () => {
            fixture.detectChanges();
            const selectedExpansions = expansions.slice(0, 1);
            const expansionsPatch: boolean[] = expansions.map(() => false);
            expansionsPatch[0] = true;
            const emitSpy = spyOn(component.change, 'emit');

            component.formGroup.patchValue({ expansions: expansionsPatch });

            expect(emitSpy).toHaveBeenCalledWith(selectedExpansions);
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
    });
});
