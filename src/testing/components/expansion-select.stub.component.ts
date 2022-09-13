import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Expansion } from 'src/app/models/expansion';

@Component({
    selector: 'app-expansion-select',
    template: '',
})
export class ExpansionSelectStubComponent {
    @Input() expansions: Expansion[] = [];

    @Input() initialValue: Expansion[] = [];

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() readonly change: EventEmitter<Expansion[]> = new EventEmitter<Expansion[]>();

    formGroup: UntypedFormGroup = new UntypedFormGroup({});
}
