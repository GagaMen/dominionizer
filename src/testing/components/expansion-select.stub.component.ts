import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Expansion } from 'src/app/models/expansion';

@Component({
    selector: 'app-expansion-select',
    template: '',
})
export class ExpansionSelectStubComponent {
    @Input() expansions: Expansion[] = [];
    formGroup: FormGroup = new FormGroup({});
}
