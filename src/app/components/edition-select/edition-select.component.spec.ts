import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionSelectComponent } from './edition-select.component';
import {
    UntypedFormBuilder,
    UntypedFormArray,
    UntypedFormControl,
    FormControlName,
} from '@angular/forms';
import { Edition } from '../../models/edition';
import { DataFixture } from 'src/testing/data-fixture';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatCheckbox } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { Chance } from 'chance';

describe('EditionSelectComponent', () => {
    let component: EditionSelectComponent;
    let fixture: ComponentFixture<EditionSelectComponent>;
    let harnessLoader: HarnessLoader;
    let dataFixture: DataFixture;
    let chance: Chance.Chance;
    let editions: Edition[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [EditionSelectComponent],
            providers: [UntypedFormBuilder],
        });

        dataFixture = new DataFixture();
        chance = new Chance();
        editions = dataFixture.createEditions();

        fixture = TestBed.createComponent(EditionSelectComponent);
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;

        component.editions = editions;
    });

    describe('editions', () => {
        it('should return editions ordered by expansion and edition', () => {
            const firstEdition = dataFixture.createEdition({ expansion: 'a', edition: '1' });
            const secondEdition = dataFixture.createEdition({ expansion: 'a', edition: '2' });
            const thirdEdition = dataFixture.createEdition({ expansion: 'b', edition: '1' });
            const input = [thirdEdition, secondEdition, firstEdition];
            const expected = [firstEdition, secondEdition, thirdEdition];
            component.editions = input;

            const actual = component.editions;

            expect(actual).toEqual(expected);
        });
    });

    describe('formGroup', () => {
        it('should have "all"-FormControl', () => {
            fixture.detectChanges();

            const actual = component.formGroup.get('all');

            expect(actual).toBeInstanceOf(UntypedFormControl);
        });

        it('should have "editions"-FormArray', () => {
            fixture.detectChanges();

            const actual = component.formGroup.get('editions');

            expect(actual).toBeInstanceOf(UntypedFormArray);
        });

        it('should have FormControl per edition inside the "editions"-FormArray', () => {
            fixture.detectChanges();
            const expected = jasmine.arrayWithExactContents(
                editions.map(() => jasmine.any(UntypedFormControl)),
            );

            const actual = (component.formGroup.get('editions') as UntypedFormArray).controls;

            expect(actual).toEqual(expected);
        });

        it('with initialValue contains not all editions should have correct initial value', () => {
            const selectedEditions = chance.pickset(
                component.editions,
                chance.integer({ min: 0, max: component.editions.length - 1 }),
            );
            const editionsState = component.editions.map((edition: Edition) =>
                selectedEditions.includes(edition),
            );
            const expected = { all: false, editions: editionsState };
            component.initialValue = selectedEditions;
            fixture.detectChanges();

            const actual = component.formGroup.value;

            expect(actual).toEqual(expected);
        });

        it('with initialValue contains all editions should have correct initial value', () => {
            const editionState = component.editions.map(() => true);
            const expected = { all: true, editions: editionState };
            component.initialValue = component.editions;
            fixture.detectChanges();

            const actual = component.formGroup.value;

            expect(actual).toEqual(expected);
        });

        it('with initialValue contains different instances of the same editions should have correct initial value', () => {
            const expected = { all: true, editions: component.editions.map(() => true) };
            component.initialValue = component.editions.map((edition: Edition) => ({ ...edition }));
            fixture.detectChanges();

            const actual = component.formGroup.value;

            expect(actual).toEqual(expected);
        });

        it('with no selected edition should be invalid', () => {
            fixture.detectChanges();

            const actual = component.formGroup.invalid;

            expect(actual).toBeTrue();
        });

        it('with selected editions change should emit change event correctly', () => {
            fixture.detectChanges();
            // the component sorts its editions, so the order differs from the input
            const selectedEditions = component.editions.slice(0, 1);
            const editionsPatch: boolean[] = component.editions.map(() => false);
            editionsPatch[0] = true;
            const emitSpy = spyOn(component.change, 'emit');

            component.formGroup.patchValue({ editions: editionsPatch });

            expect(emitSpy).toHaveBeenCalledWith(selectedEditions);
        });
    });

    describe('areSomeButNotAllSelected', () => {
        it('with at least one but not all editions are selected should return true', () => {
            fixture.detectChanges();
            const editionsPatch: boolean[] = editions.map(() => false);
            editionsPatch[0] = true;
            component.formGroup.patchValue({ editions: editionsPatch });

            const actual = component.areSomeButNotAllSelected();

            expect(actual).toBeTrue();
        });

        it('with no edition is selected should return false', () => {
            fixture.detectChanges();
            const editionsPatch: boolean[] = editions.map(() => false);
            component.formGroup.patchValue({ editions: editionsPatch });

            const actual = component.areSomeButNotAllSelected();

            expect(actual).toBeFalse();
        });

        it('with all edition are selected should return false', () => {
            fixture.detectChanges();
            const editionsPatch: boolean[] = editions.map(() => true);
            component.formGroup.patchValue({ editions: editionsPatch });

            const actual = component.areSomeButNotAllSelected();

            expect(actual).toBeFalse();
        });
    });

    describe('areAllSelected', () => {
        it('with all editions are selected should return true', () => {
            fixture.detectChanges();
            const editionsPatch: boolean[] = editions.map(() => true);
            component.formGroup.patchValue({ editions: editionsPatch });

            const actual = component.areAllSelected();

            expect(actual).toBeTrue();
        });

        it('with not all editions are selected should return false', () => {
            fixture.detectChanges();
            const editionsPatch: boolean[] = editions.map(() => true);
            editionsPatch[0] = false;
            component.formGroup.patchValue({ editions: editionsPatch });

            const actual = component.areAllSelected();

            expect(actual).toBeFalse();
        });
    });

    describe('selectOrDeselectAll', () => {
        it('with checked is true should select all editions', () => {
            fixture.detectChanges();
            const checked = true;
            const expected = editions.map(() => checked);

            component.selectOrDeselectAll(checked);
            const actual: boolean[] = component.formGroup.value.editions;

            expect(actual).toEqual(expected);
        });

        it('with checked is false should deselect all editions', () => {
            fixture.detectChanges();
            const checked = false;
            const expected = editions.map(() => checked);

            component.selectOrDeselectAll(checked);
            const actual: boolean[] = component.formGroup.value.editions;

            expect(actual).toEqual(expected);
        });
    });

    describe('hasValidationError', () => {
        it('with untouched formGroup should return false', () => {
            fixture.detectChanges();

            const actual = component.hasValidationError();

            expect(actual).toBeFalse();
        });

        it('with valid formGroup should return false', () => {
            fixture.detectChanges();
            const editionsPatch: boolean[] = component.editions.map(() => false);
            editionsPatch[0] = true;
            component.formGroup.patchValue({ editions: editionsPatch });
            component.formGroup.markAllAsTouched();

            const actual = component.hasValidationError();

            expect(actual).toBeFalse();
        });

        it('with invalid and touched formGroup should return true', () => {
            fixture.detectChanges();
            component.formGroup.markAllAsTouched();

            const actual = component.hasValidationError();

            expect(actual).toBeTrue();
        });
    });

    describe('showValidationError', () => {
        it('should mark formGroup as touched', () => {
            fixture.detectChanges();

            component.showValidationError();

            expect(component.formGroup.touched).toBeTrue();
        });

        it('should scroll host element into view', () => {
            fixture.detectChanges();
            const scrollIntoViewSpy = spyOn(fixture.nativeElement as HTMLElement, 'scrollIntoView');

            component.showValidationError();

            expect(scrollIntoViewSpy).toHaveBeenCalledWith({
                behavior: 'smooth',
                block: 'start',
            });
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

        it('without validation error should not render error message', () => {
            fixture.detectChanges();
            spyOn(component, 'hasValidationError').and.returnValue(false);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('.error-message'));

            expect(actual).toBeNull();
        });

        it('with validation error should render error message', () => {
            fixture.detectChanges();
            spyOn(component, 'hasValidationError').and.returnValue(true);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('.error-message'));

            expect((actual.nativeElement as HTMLElement).textContent).toBe(
                'Choose at least one expansion',
            );
        });

        it('without validation error should not mark form as invalid', () => {
            fixture.detectChanges();
            spyOn(component, 'hasValidationError').and.returnValue(false);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('form.invalid'));

            expect(actual).toBeNull();
        });

        it('with validation error should mark form as invalid', () => {
            fixture.detectChanges();
            spyOn(component, 'hasValidationError').and.returnValue(true);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('form.invalid'));

            expect(actual).not.toBeNull();
        });

        it('should bind ul element to "editions"-FormArray', () => {
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('ul[formArrayName="editions"]'));

            expect(actual).not.toBeNull();
        });

        it('should render checkbox inside li element for each edition correctly', async () => {
            component.editions = [
                dataFixture.createEdition({ expansion: 'Dominion', edition: '1' }),
                dataFixture.createEdition({ expansion: 'Dominion', edition: '2' }),
                dataFixture.createEdition({ expansion: 'Seaside', edition: '1' }),
            ];
            fixture.detectChanges();

            const actual = await harnessLoader.getAllHarnesses(
                MatCheckboxHarness.with({ ancestor: 'li' }),
            );

            expect(actual).toHaveSize(3);
            expect(await actual[0].getLabelText()).toBe('Dominion (1. Edition)');
            expect(await actual[1].getLabelText()).toBe('Dominion (2. Edition)');
            expect(await actual[2].getLabelText()).toBe('Seaside');
        });

        it('should bind checkbox for each edition correctly', () => {
            fixture.detectChanges();

            const actual = fixture.debugElement
                .queryAll(By.css('li'))
                .map((element) =>
                    element.query(By.directive(MatCheckbox)).injector.get(FormControlName),
                );

            expect(actual).toHaveSize(editions.length);
            for (let index = 0; index < actual.length; index++) {
                expect(actual[index].name).toBe(index);
            }
        });
    });
});
