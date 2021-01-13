import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors, AbstractControl } from '@angular/forms';
import { Expansion } from '../../models/expansion';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
    selector: 'app-expansion-select',
    templateUrl: './expansion-select.component.html',
    styleUrls: ['./expansion-select.component.scss'],
})
export class ExpansionSelectComponent implements OnInit {
    private _expansions: Expansion[] = [];
    get expansions(): Expansion[] {
        return this._expansions;
    }
    @Input() set expansions(value: Expansion[]) {
        this._expansions = value.sort((a: Expansion, b: Expansion) => a.name.localeCompare(b.name));
    }

    formGroup: FormGroup = new FormGroup({});

    constructor(
        private configurationService: ConfigurationService,
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
        this.buildFormGroup();
        this.initConfigurationUpdating();
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

    private initConfigurationUpdating(): void {
        this.formGroup.get('expansions')?.valueChanges.subscribe((expansionsState: boolean[]) => {
            const selectedExpansions = this.expansions.filter(
                (_, index: number) => expansionsState[index] === true,
            );
            this.configurationService.updateExpansions(selectedExpansions);
        });
    }

    areSomeButNotAllSelected(): boolean {
        const selectedExpansionCount: number = (this.formGroup.value
            .expansions as boolean[]).filter((expansionSelected) => expansionSelected).length;

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
