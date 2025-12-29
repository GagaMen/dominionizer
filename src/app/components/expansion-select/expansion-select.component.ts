import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    ValidationErrors,
    AbstractControl,
    ReactiveFormsModule,
} from '@angular/forms';
import { Expansion } from '../../models/expansion';

import { MatDivider } from '@angular/material/divider';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
    selector: 'app-expansion-select',
    imports: [MatCheckbox, MatDivider, ReactiveFormsModule],
    templateUrl: './expansion-select.component.html',
    styleUrls: ['./expansion-select.component.scss'],
})
export class ExpansionSelectComponent implements OnInit {
    private formBuilder = inject(UntypedFormBuilder);

    private _expansions: Expansion[] = [];
    get expansions(): Expansion[] {
        return this._expansions;
    }
    @Input() set expansions(value: Expansion[]) {
        this._expansions = value.sort((a: Expansion, b: Expansion) => a.name.localeCompare(b.name));
    }

    @Input() initialValue: Expansion[] = [];

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() readonly change: EventEmitter<Expansion[]> = new EventEmitter<Expansion[]>();

    formGroup: UntypedFormGroup = new UntypedFormGroup({});

    private static validateMinSelect(control: AbstractControl): ValidationErrors | null {
        const controlValues: boolean[] = Object.values(control.value as { [s: string]: boolean });
        const result = controlValues.reduce(
            (previousValue: boolean, currentValue: boolean) => previousValue || currentValue,
        );
        return result ? null : { minSelect: { value: control.value } };
    }

    ngOnInit(): void {
        const expansionFormControls = this.expansions.map((expansion: Expansion) => {
            const isExpansionSelected = this.initialValue.includes(expansion);
            return this.formBuilder.control(isExpansionSelected);
        });
        this.formGroup = this.formBuilder.group({
            all: this.initialValue.length === this.expansions.length,
            expansions: this.formBuilder.array(
                expansionFormControls,
                ExpansionSelectComponent.validateMinSelect,
            ),
        });

        this.formGroup.get('expansions')?.valueChanges.subscribe((expansionsState: boolean[]) => {
            const selectedExpansions = this.expansions.filter(
                (_, index: number) => expansionsState[index] === true,
            );
            this.change.emit(selectedExpansions);
        });
    }

    areSomeButNotAllSelected(): boolean {
        const selectedExpansionCount: number = (
            this.formGroup.value.expansions as boolean[]
        ).filter((expansionSelected) => expansionSelected).length;

        return selectedExpansionCount > 0 && selectedExpansionCount < this.expansions.length;
    }

    areAllSelected(): boolean {
        return (this.formGroup.value.expansions as boolean[]).every(
            (expansionSelected) => expansionSelected,
        );
    }

    selectOrDeselectAll(checked: boolean): void {
        const expansionsPatch: boolean[] = this.expansions.map(() => checked);
        this.formGroup.patchValue({ expansions: expansionsPatch });
    }
}
