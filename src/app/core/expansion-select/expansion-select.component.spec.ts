import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionSelectComponent } from './expansion-select.component';
import { ConfigurationService } from '../services/configuration.service';
import {
    FormBuilder,
    ReactiveFormsModule,
    FormArray,
    FormControl,
    AbstractControl,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { Expansion } from '../models/expansion';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { ExpansionService } from '../services/expansion.service';
import { SpyObj } from 'src/testing/spy-obj';

describe('ExpansionSelectComponent', () => {
    let component: ExpansionSelectComponent;
    let fixture: ComponentFixture<ExpansionSelectComponent>;
    let expansionServiceSpy: SpyObj<ExpansionService>;
    const defaultExpansions: Expansion[] = [
        { id: 1, name: 'Test Expansion 1' },
        { id: 2, name: 'Test Expansion 2' },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatSlideToggleModule, MatDividerModule],
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

        expansionServiceSpy = TestBed.get(ExpansionService);
        const defaultExpansions$: Observable<Expansion[]> = cold('--(a|)', {
            a: defaultExpansions,
        });
        expansionServiceSpy.expansions$ = defaultExpansions$;

        fixture = TestBed.createComponent(ExpansionSelectComponent);
        component = fixture.componentInstance;
        getTestScheduler().flush();
        fixture.detectChanges();
    });

    describe('expansions', () => {
        it('should return same value as expansionService.expansions$', () => {
            const expansions = component.expansions;

            expect(expansions).toBe(defaultExpansions);
        });
    });

    describe('formGroup', () => {
        it('should contain a "selectAll"-FormControl', () => {
            const formControl: FormControl = component.formGroup.get('selectAll') as FormControl;

            expect(formControl).toBeTruthy();
        });

        it('should contain a "expansions"-FormArray', () => {
            const formArray: FormArray = component.formGroup.get('expansions') as FormArray;

            expect(formArray).toBeTruthy();
        });

        it('should contain a FormControl per expansion inside the "expansions"-FormArray', () => {
            const formArray: FormArray = component.formGroup.get('expansions') as FormArray;
            const expansionFormControls: AbstractControl[] = formArray.controls;

            expect(expansionFormControls.length).toBe(defaultExpansions.length);
            expansionFormControls.forEach((control: AbstractControl) => {
                expect(control instanceof FormControl).toBe(true);
            });
        });

        it('with "selectAll"-FormControl is set to true should set all "expansions"-FormControls to true', () => {
            const selectAllFormControl: FormControl = component.formGroup.get(
                'selectAll',
            ) as FormControl;
            const expansionFormControls: FormControl[] = (component.formGroup.get(
                'expansions',
            ) as FormArray).controls as FormControl[];

            selectAllFormControl.setValue(true);

            expansionFormControls.forEach((expansionFormControl: FormControl) => {
                expect(expansionFormControl.value).toBe(true);
            });
        });

        it('with all "expansions"-FormControls are set to true and then one "expansion"-FormControl is set to false should set "selectAll"-FormControl to false', () => {
            const selectAllFormControl: FormControl = component.formGroup.get(
                'selectAll',
            ) as FormControl;
            const singleExpansionFormControl: FormControl = (component.formGroup.get(
                'expansions',
            ) as FormArray).controls[0] as FormControl;
            selectAllFormControl.setValue(true);

            singleExpansionFormControl.setValue(false);

            expect(selectAllFormControl.value).toBe(false);
        });

        it('with no "expansions"-FormControl is set to true should be invalid', () => {
            expect(component.formGroup.invalid).toBe(true);
        });
    });

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
