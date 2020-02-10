import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, ValidationErrors } from '@angular/forms';
import { Expansion } from '../models/expansion';
import { ConfigurationService } from '../services/configuration.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-expansion-select',
  templateUrl: './expansion-select.component.html',
  styleUrls: ['./expansion-select.component.scss']
})
export class ExpansionSelectComponent {
  @Output() submit: EventEmitter<any> = new EventEmitter();
  expansions: Expansion[] = [];
  formGroup: FormGroup = null;

  constructor(
    private configurationService: ConfigurationService,
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    this.dataService.fetchExpansions().subscribe((expansions: Expansion[]) => {
      this.expansions = expansions;
      this.buildFormGroup();
      this.initializeToggleBehaviour();
    });
  }

  private static validateMinSelect(control: FormArray): ValidationErrors | null {
    const controlValues = Object.values(control.value);
    const result = controlValues.reduce((previousValue: boolean, currentValue: boolean) => previousValue || currentValue);
    return result ? null : { minSelect: { value: control.value } };
  }

  private buildFormGroup() {
    this.formGroup = this.formBuilder.group({
      expansions: new FormArray(this.expansions.map(() => new FormControl(false)), ExpansionSelectComponent.validateMinSelect),
      selectAll: new FormControl(false),
    });
  }

  private initializeToggleBehaviour(): void {
    this.formGroup.get('selectAll').valueChanges.subscribe(bool => {
      const expansions = this.formGroup.get('expansions') as FormArray;
      expansions.patchValue(Array(expansions.length).fill(bool), { emitEvent: false });
    });

    this.formGroup.get('expansions').valueChanges.subscribe(val => {
        const allSelected = val.every(bool => bool);
        if (this.formGroup.get('selectAll').value !== allSelected) {
          this.formGroup.get('selectAll').patchValue(allSelected, { emitEvent: false });
        }
    });
  }

  onNgSubmit(): void {
    const expansionStates = this.formGroup.value;
    const enabledExpansions = this.expansions.filter((_, index: number) => expansionStates.expansions[index] === true);
    this.configurationService.updateExpansions(enabledExpansions);

    this.submit.emit();
  }
}
