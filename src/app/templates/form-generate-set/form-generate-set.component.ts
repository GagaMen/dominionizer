import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';

@Component({
  selector: 'app-form-generate-set',
  templateUrl: './form-generate-set.component.html',
  styleUrls: ['./form-generate-set.component.scss']
})
// https://coryrylan.com/blog/creating-a-dynamic-checkbox-list-in-angular
export class FormGenerateSetComponent implements OnInit {
  form: FormGroup;
  extensions = [];

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      extensions: new FormArray([], this.minSelectedSwitches(1))
    });

    this.extensions = FormGenerateSetComponent.getExtensions();
    this.addSwitches();
  }

  static getExtensions() {
    return [
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
  }

  ngOnInit() {
  }

  private minSelectedSwitches(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);

      return totalSelected >= min ? null : { required: true };
    };

    return validator;
  }

  private addSwitches() {
    this.extensions.map((_, i) => {
      const control = new FormControl(i === 0);
      (this.form.controls.extensions as FormArray).push(control);
    });
  }

  submit() { }
}
