import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Edition } from 'src/app/models/edition';

@Component({
    selector: 'app-edition-select',
    standalone: true,
    template: '',
})
export class EditionSelectStubComponent {
    @Input() editions: Edition[] = [];

    @Input() initialValue: Edition[] = [];

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() readonly change: EventEmitter<Edition[]> = new EventEmitter<Edition[]>();

    formGroup: UntypedFormGroup = new UntypedFormGroup({});
}
