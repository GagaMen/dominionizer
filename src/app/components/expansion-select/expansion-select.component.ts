import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    FormArray,
    ValidationErrors,
    AbstractControl,
} from '@angular/forms';
import { Expansion } from '../../models/expansion';
import { ConfigurationService } from '../../services/configuration.service';
import { ExpansionService } from '../../services/expansion.service';

@Component({
    selector: 'app-expansion-select',
    templateUrl: './expansion-select.component.html',
    styleUrls: ['./expansion-select.component.scss'],
})
export class ExpansionSelectComponent implements OnInit {
    @Output() submitForm: EventEmitter<void> = new EventEmitter<void>();
    expansions: Expansion[] = [];
    formGroup: FormGroup = new FormGroup({});

    constructor(
        private configurationService: ConfigurationService,
        private expansionService: ExpansionService,
        private formBuilder: FormBuilder,
    ) {}

    private static validateMinSelect(control: AbstractControl): ValidationErrors | null {
        const controlValues: boolean[] = Object.values(control.value);
        const result = controlValues.reduce(
            (previousValue: boolean, currentValue: boolean) => previousValue || currentValue,
        );
        return result ? null : { minSelect: { value: control.value } };
    }

    ngOnInit(): void {
        this.expansionService.expansions$.subscribe((expansions: Expansion[]) => {
            this.expansions = expansions;
            this.buildFormGroup();
            this.initializeToggleBehaviour();
        });
    }

    private buildFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            all: false,
            expansions: this.formBuilder.array(
                this.expansions.map(() => this.formBuilder.control(false)),
                ExpansionSelectComponent.validateMinSelect,
            ),
        });
    }

    private initializeToggleBehaviour(): void {
        this.formGroup.get('all')?.valueChanges.subscribe((value: boolean) => {
            const expansions = this.formGroup.get('expansions') as FormArray;
            const expansionsPatch = new Array(expansions.length).fill(value);
            expansions.patchValue(expansionsPatch, { emitEvent: false });
        });

        this.formGroup.get('expansions')?.valueChanges.subscribe((value: boolean[]) => {
            const allPatch = value.every((bool: boolean) => bool);
            this.formGroup.get('all')?.patchValue(allPatch, { emitEvent: false });
        });
    }

    onNgSubmit(): void {
        const expansionStates = this.formGroup.value;
        const enabledExpansions = this.expansions.filter(
            (_, index: number) => expansionStates.expansions[index] === true,
        );
        this.configurationService.updateExpansions(enabledExpansions);

        this.submitForm.emit();
    }
}
