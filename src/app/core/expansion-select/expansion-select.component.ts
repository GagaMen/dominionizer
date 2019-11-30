import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, ValidationErrors } from '@angular/forms';
import { Expansion } from '../models/expansion';
import { ConfigurationService } from '../services/configuration.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-expansion-select',
  templateUrl: './expansion-select.component.html',
  styleUrls: ['./expansion-select.component.scss']
})
export class ExpansionSelectComponent implements OnInit {
  @Output() submit: EventEmitter<any> = new EventEmitter();
  expansions: Expansion[] = [];
  formGroup: FormGroup = null;

  constructor(
    private configurationService: ConfigurationService,
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.dataService.expansions().subscribe((expansions: Expansion[]) => {
      this.expansions = expansions;
      this.buildFormGroup();
      this.initializeToggleBehaviour();
    });
  }

  private buildFormGroup() {
    this.formGroup = this.formBuilder.group({
      expansions: new FormArray(this.expansions.map(() => new FormControl(false)), ExpansionSelectComponent.validateMinSelect),
      selectAll: new FormControl(false),
    });
  }

  private static validateMinSelect(control: FormArray): ValidationErrors | null {
    const controlValues = Object.values(control.value);
    const result = controlValues.reduce((previousValue: boolean, currentValue: boolean) => previousValue || currentValue);
    return result ? null : { minSelect: { value: control.value } };
  }

  initializeToggleBehaviour(): void {
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

    this.formGroup.get('expansions').valueChanges.subscribe((expansionStates: boolean[]) => {
      const enabledExpansions = this.expansions.filter((_, index: number) => expansionStates[index] === true);
      this.configurationService.updateExpansions(enabledExpansions);
    });
  }

  onNgSubmit(): void {
    this.submit.emit();
  }
}
