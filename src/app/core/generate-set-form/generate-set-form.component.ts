import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DataService } from '../services/data.service';
import { Extension } from '../models/extension';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-set-form',
  templateUrl: './generate-set-form.component.html',
  styleUrls: ['./generate-set-form.component.scss'],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
  ]
})

export class GenerateSetFormComponent implements OnInit {
  firstStep: FormGroup = null;
  secondStep: FormGroup = null;
  extensions: Extension[];

  constructor(private dataService: DataService, private formBuilder: FormBuilder, private router: Router) {}

  private static validateMinSelect(control: FormArray): ValidationErrors | null {
    const controlValues = Object.values(control.value);
    const result = controlValues.reduce((previousValue: boolean, currentValue: boolean) => previousValue || currentValue);
    return result ? null : { minSelect: { value: control.value } };
  }

  ngOnInit() {
    this.dataService.extensions().subscribe((extensions: Extension[]) => {
      this.extensions = extensions;

      this.buildFirstStep(extensions);
      this.buildSecondStep();
      this.onChange();
    });

  }

  private buildFirstStep(extensions: Extension[]) {
    this.firstStep = this.formBuilder.group({
      extensions: new FormArray(extensions.map(() => new FormControl(false)), GenerateSetFormComponent.validateMinSelect),
      selectAll: new FormControl(false),
    });
  }

  private buildSecondStep() {
    this.secondStep = this.formBuilder.group({
      events: new FormControl(false),
      eventCount: new FormControl(1),
      landmarks: new FormControl(false),
      landmarkCount: new FormControl(1),
      reactionOnAttack: new FormControl(false),
    });
  }

  onChange(): void {
    this.firstStep.get('selectAll').valueChanges.subscribe(bool => {
      const extensions = this.firstStep.get('extensions') as FormArray;
      extensions.patchValue(Array(extensions.length).fill(bool), { emitEvent: false });
    });

    this.firstStep.get('extensions').valueChanges.subscribe(val => {
        const allSelected = val.every(bool => bool);
        if (this.firstStep.get('selectAll').value !== allSelected) {
          this.firstStep.get('selectAll').patchValue(allSelected, { emitEvent: false });
        }
    });
  }

  onSubmit() {
    this.router.navigate(['result']);
  }
}
