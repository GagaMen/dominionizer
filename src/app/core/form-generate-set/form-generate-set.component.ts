import { Component, OnInit, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-generate-set',
  templateUrl: './form-generate-set.component.html',
  styleUrls: ['./form-generate-set.component.scss']
})

export class FormGenerateSetComponent implements OnInit {
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
    const extensionControls = this.extensions.map(control => new FormControl(false));
    const selectAllControl = new FormControl(false);

    this.firstStep = this.formBuilder.group({
      extensions: new FormArray(extensionControls),
      selectAll: selectAllControl
    })
  }

  ngOnInit() {
    this.onChange()
  }

  onChange(): void {
    this.firstStep.get('selectAll').valueChanges.subscribe(bool => {
      this.firstStep
        .get('extensions')
        .patchValue(Array(this.extensions.length).fill(bool), { emitEvent: false });
    });

    this.firstStep.get('extensions').valueChanges.subscribe(val => {
        const allSelected = val.every(bool => bool);
        if (this.firstStep.get('selectAll').value != allSelected) {
          this.firstStep.get('selectAll').patchValue(allSelected, { emitEvent: false });
        }
    });
  }

  submit() { }
}
