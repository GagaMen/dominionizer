import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Edition } from 'src/app/models/edition';
import { EditionSelectComponent } from 'src/app/components/edition-select/edition-select.component';

@Component({
    selector: 'app-edition-select',
    standalone: true,
    template: '',
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [{ provide: EditionSelectComponent, useExisting: EditionSelectStubComponent }],
})
export class EditionSelectStubComponent {
    readonly editions = input<Edition[]>([]);

    readonly initialValue = input<Edition[]>([]);

    // eslint-disable-next-line @angular-eslint/no-output-native
    readonly change = output<Edition[]>();

    formGroup: UntypedFormGroup = new UntypedFormGroup({});

    showValidationError(): void {
        // intentionally empty
    }
}
