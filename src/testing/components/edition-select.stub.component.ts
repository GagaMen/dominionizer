import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Edition } from 'src/app/models/edition';
import { EditionSelectComponent } from 'src/app/components/edition-select/edition-select.component';

@Component({
    selector: 'app-edition-select',
    standalone: true,
    template: '',
    providers: [{ provide: EditionSelectComponent, useExisting: EditionSelectStubComponent }],
})
export class EditionSelectStubComponent {
    @Input() editions: Edition[] = [];

    @Input() initialValue: Edition[] = [];

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() readonly change: EventEmitter<Edition[]> = new EventEmitter<Edition[]>();

    formGroup: UntypedFormGroup = new UntypedFormGroup({});

    showValidationError(): void {
        // intentionally empty
    }
}
