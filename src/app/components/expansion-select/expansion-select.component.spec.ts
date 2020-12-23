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
import { detectChangesAndFlush } from 'src/testing/utilities';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';

describe('ExpansionSelectComponent', () => {
    let component: ExpansionSelectComponent;
    let fixture: ComponentFixture<ExpansionSelectComponent>;
    let harnessLoader: HarnessLoader;
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

        expansionServiceSpy = TestBed.inject(ExpansionService);
        expansionServiceSpy.expansions$ = cold('--(a|)', {
            a: expansions,
        });

        fixture = TestBed.createComponent(ExpansionSelectComponent);
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
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
    });

    describe('template', () => {
        it('should render checkbox for "all"-FormControl correctly', async () => {
            detectChangesAndFlush(fixture);
            const matCheckbox = await harnessLoader.getHarness(MatCheckboxHarness);

            expect(await matCheckbox.getLabelText()).toBe('All');
        });

        it('should bind checkbox for "all"-FormControl correctly', () => {
            detectChangesAndFlush(fixture);
            const actual = fixture.debugElement.query(
                By.css('mat-checkbox[formControlName="all"]'),
            );

            expect(actual).not.toBeNull();
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
    });
    // describe('formGroup', () => {
    //     it('with "selectAll"-FormControl is set to true should set all "expansions"-FormControls to true', () => {
    //         const selectAllFormControl: FormControl = component.formGroup.get(
    //             'selectAll',
    //         ) as FormControl;
    //         const expansionFormControls: FormControl[] = (component.formGroup.get(
    //             'expansions',
    //         ) as FormArray).controls as FormControl[];

    //         selectAllFormControl.setValue(true);

    //         expansionFormControls.forEach((expansionFormControl: FormControl) => {
    //             expect(expansionFormControl.value).toBe(true);
    //         });
    //     });

    //     it('with all "expansions"-FormControls are set to true and then one "expansion"-FormControl is set to false should set "selectAll"-FormControl to false', () => {
    //         const selectAllFormControl: FormControl = component.formGroup.get(
    //             'selectAll',
    //         ) as FormControl;
    //         const singleExpansionFormControl: FormControl = (component.formGroup.get(
    //             'expansions',
    //         ) as FormArray).controls[0] as FormControl;
    //         selectAllFormControl.setValue(true);

    //         singleExpansionFormControl.setValue(false);

    //         expect(selectAllFormControl.value).toBe(false);
    //     });

    //     it('with no "expansions"-FormControl is set to true should be invalid', () => {
    //         expect(component.formGroup.invalid).toBe(true);
    //     });
    // });

    // TODO: complete tests
    // describe('onNgSubmit', () => {
    //   it('should emit submit-Event', () => {
    //     const expected$ = cold('a');

    //     component.onNgSubmit();

    //     expect(component.submit).toBeObservable(expected$);
    //   });
    // });

    // describe('template', () => {
    // });
});
