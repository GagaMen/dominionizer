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
import { cold, getTestScheduler } from 'jasmine-marbles';
import { ExpansionService } from '../../services/expansion.service';
import { SpyObj } from 'src/testing/spy-obj';
import { DataFixture } from 'src/testing/data-fixture';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { detectChangesAndFlush } from 'src/testing/utilities';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';

fdescribe('ExpansionSelectComponent', () => {
    let component: ExpansionSelectComponent;
    let fixture: ComponentFixture<ExpansionSelectComponent>;
    let harnessLoader: HarnessLoader;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let expansionServiceSpy: SpyObj<ExpansionService>;
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
                {
                    provide: ExpansionService,
                    useValue: {},
                },
                FormBuilder,
            ],
        });

        dataFixture = new DataFixture();
        expansions = dataFixture.createExpansions();

        configurationServiceSpy = TestBed.inject(ConfigurationService) as jasmine.SpyObj<
            ConfigurationService
        >;

        expansionServiceSpy = TestBed.inject(ExpansionService);
        expansionServiceSpy.expansions$ = cold('--(a|)', {
            a: expansions,
        });

        fixture = TestBed.createComponent(ExpansionSelectComponent);
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
    });

    describe('formGroup', () => {
        it('should has "all"-FormControl unchecked after initialization', () => {
            detectChangesAndFlush(fixture);

            const actual = component.formGroup.value.all;

            expect(actual).toBeFalse();
        });

        it('should has all expansions unselected after initialization', () => {
            detectChangesAndFlush(fixture);
            const expected = expansions.map(() => false);

            const actual = component.formGroup.value.expansions;

            expect(actual).toEqual(expected);
        });

        it('with no selected expansion should be invalid', () => {
            detectChangesAndFlush(fixture);

            const actual = component.formGroup.invalid;

            expect(actual).toBeTrue();
        });
    });

    describe('ngOnInit', () => {
        it('should set expansions to value from expansionService.expansions$', () => {
            const expected = expansions;

            fixture.detectChanges();
            getTestScheduler().flush();
            const actual = component.expansions;

            expect(actual).toBe(expected);
        });

        it('should set formGroup with "all"-FormControl', () => {
            fixture.detectChanges();
            getTestScheduler().flush();
            const actual = component.formGroup.get('all');

            expect(actual).toBeInstanceOf(FormControl);
        });

        it('should set formGroup with "expansions"-FormArray', () => {
            fixture.detectChanges();
            getTestScheduler().flush();
            const actual = component.formGroup.get('expansions');

            expect(actual).toBeInstanceOf(FormArray);
        });

        it('should set formGroup with FormControl per expansion inside the "expansions"-FormArray', () => {
            const expected = jasmine.arrayWithExactContents(
                expansions.map(() => jasmine.any(FormControl)),
            );

            fixture.detectChanges();
            getTestScheduler().flush();
            const actual = (component.formGroup.get('expansions') as FormArray).controls;

            expect(actual).toEqual(expected);
        });

        it('should set up updating of configuration when selected expansions change', () => {
            const selectedExpansions = expansions.slice(0, 1);
            const expansionsPatch: boolean[] = expansions.map(() => false);
            expansionsPatch[0] = true;

            fixture.detectChanges();
            getTestScheduler().flush();
            component.formGroup.patchValue({ expansions: expansionsPatch });

            expect(configurationServiceSpy.updateExpansions).toHaveBeenCalledWith(
                selectedExpansions,
            );
        });
    });

    describe('areSomeButNotAllSelected', () => {
        it('with at least one but not all expansions are selected should return true', () => {
            detectChangesAndFlush(fixture);
            const expansionsPatch: boolean[] = expansions.map(() => false);
            expansionsPatch[0] = true;
            component.formGroup.patchValue({ expansions: expansionsPatch });

            const actual = component.areSomeButNotAllSelected();

            expect(actual).toBeTrue();
        });

        it('with no expansion is selected should return false', () => {
            detectChangesAndFlush(fixture);
            const expansionsPatch: boolean[] = expansions.map(() => false);
            component.formGroup.patchValue({ expansions: expansionsPatch });

            const actual = component.areSomeButNotAllSelected();

            expect(actual).toBeFalse();
        });

        it('with all expansion are selected should return false', () => {
            detectChangesAndFlush(fixture);
            const expansionsPatch: boolean[] = expansions.map(() => true);
            component.formGroup.patchValue({ expansions: expansionsPatch });

            const actual = component.areSomeButNotAllSelected();

            expect(actual).toBeFalse();
        });
    });

    describe('areAllSelected', () => {
        it('with all expansions are selected should return true', () => {
            detectChangesAndFlush(fixture);
            const expansionsPatch: boolean[] = expansions.map(() => true);
            component.formGroup.patchValue({ expansions: expansionsPatch });

            const actual = component.areAllSelected();

            expect(actual).toBeTrue();
        });

        it('with not all expansions are selected should return false', () => {
            detectChangesAndFlush(fixture);
            const expansionsPatch: boolean[] = expansions.map(() => true);
            expansionsPatch[0] = false;
            component.formGroup.patchValue({ expansions: expansionsPatch });

            const actual = component.areAllSelected();

            expect(actual).toBeFalse();
        });
    });

    describe('selectOrDeselectAll', () => {
        it('with checked is true should select all expansions', () => {
            detectChangesAndFlush(fixture);
            const checked = true;
            const expected = expansions.map(() => checked);

            component.selectOrDeselectAll(checked);
            const actual: boolean[] = component.formGroup.value.expansions;

            expect(actual).toEqual(expected);
        });

        it('with checked is false should deselect all expansions', () => {
            detectChangesAndFlush(fixture);
            const checked = false;
            const expected = expansions.map(() => checked);

            component.selectOrDeselectAll(checked);
            const actual: boolean[] = component.formGroup.value.expansions;

            expect(actual).toEqual(expected);
        });
    });

    describe('template', () => {
        it('should render checkbox for "all"-FormControl correctly', async () => {
            detectChangesAndFlush(fixture);
            const matCheckbox = await harnessLoader.getHarness(MatCheckboxHarness);

            const actual = await matCheckbox.getLabelText();

            expect(actual).toBe('All');
        });

        it('should bind checkbox to "all"-FormControl correctly', () => {
            detectChangesAndFlush(fixture);

            const actual = fixture.debugElement.query(
                By.css('mat-checkbox[formControlName="all"]'),
            );

            expect(actual).not.toBeNull();
        });

        it('should bind "checked" input property of "all" checkbox correctly', async () => {
            detectChangesAndFlush(fixture);
            const expected = true;
            spyOn(component, 'areAllSelected').and.returnValue(expected);
            const matCheckbox = await harnessLoader.getHarness(MatCheckboxHarness);

            const actual = await matCheckbox.isChecked();

            expect(actual).toBe(expected);
        });

        it('should bind "indeterminate" input property of "all" checkbox correctly', async () => {
            detectChangesAndFlush(fixture);
            const expected = true;
            spyOn(component, 'areSomeButNotAllSelected').and.returnValue(expected);
            const matCheckbox = await harnessLoader.getHarness(MatCheckboxHarness);

            const actual = await matCheckbox.isIndeterminate();

            expect(actual).toBe(expected);
        });

        it('should bind "change" output property of "all" checkbox correctly', async () => {
            detectChangesAndFlush(fixture);
            const selectOrDeselectAllSpy = spyOn(component, 'selectOrDeselectAll');
            const matCheckbox = await harnessLoader.getHarness(MatCheckboxHarness);

            await matCheckbox.check();

            expect(selectOrDeselectAllSpy).toHaveBeenCalledWith(true);
        });

        it('should bind ul element to "expansions"-FormArray', () => {
            detectChangesAndFlush(fixture);

            const actual = fixture.debugElement.query(By.css('ul[formArrayName="expansions"]'));

            expect(actual).not.toBeNull();
        });

        it('should render checkbox inside li element for each expansion correctly', async () => {
            detectChangesAndFlush(fixture);

            const actual = await harnessLoader.getAllHarnesses(
                MatCheckboxHarness.with({ ancestor: 'li' }),
            );

            expect(actual).toHaveSize(expansions.length);
            for (let index = 0; index < actual.length; index++) {
                expect(await actual[index].getLabelText()).toBe(expansions[index].name);
            }
        });

        it('should bind checkbox for each expansion correctly', () => {
            detectChangesAndFlush(fixture);

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
            detectChangesAndFlush(fixture);

            const matButton = harnessLoader.getHarness(
                MatButtonHarness.with({ selector: '[matStepperNext]' }),
            );

            expect(matButton).not.toBeNull();
        });
    });
});
