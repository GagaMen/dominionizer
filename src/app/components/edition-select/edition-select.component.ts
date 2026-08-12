import { Component, ElementRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    ValidationErrors,
    AbstractControl,
    ReactiveFormsModule,
} from '@angular/forms';
import { Edition } from '../../models/edition';

import { MatDivider } from '@angular/material/divider';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
    selector: 'app-edition-select',
    imports: [MatCheckbox, MatDivider, ReactiveFormsModule],
    templateUrl: './edition-select.component.html',
    styleUrls: ['./edition-select.component.scss'],
})
export class EditionSelectComponent implements OnInit {
    private formBuilder = inject(UntypedFormBuilder);
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    private _editions: Edition[] = [];
    get editions(): Edition[] {
        return this._editions;
    }
    @Input() set editions(value: Edition[]) {
        this._editions = [...value].sort(
            (a: Edition, b: Edition) =>
                a.expansion.localeCompare(b.expansion) || a.edition.localeCompare(b.edition),
        );
    }

    @Input() initialValue: Edition[] = [];

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() readonly change: EventEmitter<Edition[]> = new EventEmitter<Edition[]>();

    formGroup: UntypedFormGroup = new UntypedFormGroup({});

    private static validateMinSelect(control: AbstractControl): ValidationErrors | null {
        const controlValues: boolean[] = Object.values(control.value as Record<string, boolean>);
        const result = controlValues.reduce(
            (previousValue: boolean, currentValue: boolean) => previousValue || currentValue,
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return result ? null : { minSelect: { value: control.value } };
    }

    ngOnInit(): void {
        const initialValueIds = this.initialValue.map((edition: Edition) => edition.id);
        const editionFormControls = this.editions.map((edition: Edition) => {
            const isEditionSelected = initialValueIds.includes(edition.id);
            return this.formBuilder.control(isEditionSelected);
        });
        this.formGroup = this.formBuilder.group({
            all: this.initialValue.length === this.editions.length,
            editions: this.formBuilder.array(
                editionFormControls,
                EditionSelectComponent.validateMinSelect,
            ),
        });

        this.formGroup.get('editions')?.valueChanges.subscribe((editionsState: boolean[]) => {
            const selectedEditions = this.editions.filter(
                (_, index: number) => editionsState[index] === true,
            );
            this.change.emit(selectedEditions);
        });
    }

    hasValidationError(): boolean {
        return this.formGroup.invalid && this.formGroup.touched;
    }

    showValidationError(): void {
        this.formGroup.markAllAsTouched();
        this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    label(edition: Edition): string {
        const hasMultipleEditions =
            this.editions.filter((other: Edition) => other.expansion === edition.expansion).length >
            1;

        return hasMultipleEditions
            ? `${edition.expansion} (${edition.edition}. Edition)`
            : edition.expansion;
    }

    areSomeButNotAllSelected(): boolean {
        const selectedEditionCount: number =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (this.formGroup.value.editions as boolean[]).filter(
                (editionSelected) => editionSelected,
            ).length;

        return selectedEditionCount > 0 && selectedEditionCount < this.editions.length;
    }

    areAllSelected(): boolean {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return (this.formGroup.value.editions as boolean[]).every(
            (editionSelected) => editionSelected,
        );
    }

    selectOrDeselectAll(checked: boolean): void {
        const editionsPatch: boolean[] = this.editions.map(() => checked);
        this.formGroup.patchValue({ editions: editionsPatch });
    }
}
