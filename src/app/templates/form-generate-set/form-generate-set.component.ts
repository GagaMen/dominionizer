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
    const extensionControls = this.extensions.map(control => new FormControl(false));
    const selectAllControl = new FormControl(false);

    this.form = this.formBuilder.group({
      extensions: new FormArray(extensionControls),
      selectAll: selectAllControl
    })
  }

  ngOnInit() {
    this.onChange()
  }

  onChange(): void {
    this.form.get('selectAll').valueChanges.subscribe(bool => {
      this.form
        .get('extensions')
        .patchValue(Array(this.extensions.length).fill(bool), { emitEvent: false });
    });

    this.form.get('extensions').valueChanges.subscribe(val => {
        const allSelected = val.every(bool => bool);
        if (this.form.get('selectAll').value != allSelected) {
          this.form.get('selectAll').patchValue(allSelected, { emitEvent: false });
        }
    });
  }

  submit() { }
}
