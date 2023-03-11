import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SpecialCardsAvailability } from 'src/app/models/special-cards-availability';
import { SpecialCardsCount } from 'src/app/models/special-cards-count';

@Component({
    selector: 'app-special-card-select',
    template: '',
})
export class SpecialCardSelectStubComponent {
    @Input() availability: SpecialCardsAvailability = {
        events: false,
        landmarks: false,
        projects: false,
        ways: false,
        traits: false,
    };

    @Input() initialValue: SpecialCardsCount = {
        events: 0,
        landmarks: 0,
        projects: 0,
        ways: 0,
        traits: 0,
    };

    @Output()
    readonly valueChange: EventEmitter<SpecialCardsCount> = new EventEmitter<SpecialCardsCount>();

    formGroup: UntypedFormGroup = new UntypedFormGroup({});
}
