import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SpecialCardsAvailability } from 'src/app/models/special-cards-availability';
import { SpecialCardsCount } from 'src/app/models/special-cards-count';

@Component({
    selector: 'app-special-card-select',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    template: '',
})
export class SpecialCardSelectStubComponent {
    readonly availability = input<SpecialCardsAvailability>({
        events: false,
        landmarks: false,
        projects: false,
        ways: false,
        traits: false,
    });

    readonly initialValue = input<SpecialCardsCount>({
        events: 0,
        landmarks: 0,
        projects: 0,
        ways: 0,
        traits: 0,
    });

    readonly valueChange = output<SpecialCardsCount>();

    formGroup: UntypedFormGroup = new UntypedFormGroup({});
}
