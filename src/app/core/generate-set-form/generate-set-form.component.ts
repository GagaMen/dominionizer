import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-generate-set-form',
  templateUrl: './generate-set-form.component.html',
  styleUrls: ['./generate-set-form.component.scss'],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
  ]
})

export class GenerateSetFormComponent implements OnInit {
  firstStep: FormGroup;
  secondStep: FormGroup;
  extensions = [
    { id: 1, name: 'Basisspiel' },
    { id: 2, name: 'Basisspiel 2. Edition' },
    { id: 3, name: 'Die Intrige' },
    { id: 4, name: 'Seaside' },
    { id: 5, name: 'Die Alchemisten' },
    { id: 6, name: 'Blütezeit' },
    { id: 7, name: 'Reiche Ernte' },
    { id: 8, name: 'Hinterland' },
    { id: 9, name: 'Dark Ages' },
    { id: 10, name: 'Die Gilden' },
    { id: 11, name: 'Abenteuer' },
    { id: 12, name: 'Empires' },
    { id: 13, name: 'Nocturne' }
  ];

  constructor(private formBuilder: FormBuilder) {
    const extensionControls = this.extensions.map(() => new FormControl(false));
    const selectAllControl = new FormControl(false);

    this.firstStep = this.formBuilder.group({
      extensions: new FormArray(extensionControls, GenerateSetFormComponent.validateMinSelect),
      selectAll: selectAllControl
    });

    this.secondStep = this.formBuilder.group({
      events: new FormControl(false),
      eventCount: new FormControl(1),
      landmarks: new FormControl(false),
      landmarkCount: new FormControl(1),
      reactionOnAttack: new FormControl(false),
    });
  }

  private static validateMinSelect(control: FormArray): ValidationErrors | null {
    const controlValues = Object.values(control.value);
    const result = controlValues.reduce((previousValue: boolean, currentValue: boolean) => previousValue || currentValue);
    return result ? null : { minSelect: { value: control.value } };
  }

  ngOnInit() {
    this.onChange();
  }

  onChange(): void {
    this.firstStep.get('selectAll').valueChanges.subscribe(bool => {
      this.firstStep
        .get('extensions')
        .patchValue(Array(this.extensions.length).fill(bool), { emitEvent: false });
    });

    this.firstStep.get('extensions').valueChanges.subscribe(val => {
        const allSelected = val.every(bool => bool);
        if (this.firstStep.get('selectAll').value !== allSelected) {
          this.firstStep.get('selectAll').patchValue(allSelected, { emitEvent: false });
        }
    });
  }

  submit() { }
}
