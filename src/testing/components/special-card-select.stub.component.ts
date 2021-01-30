import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
    };

    @Input() initialValue: SpecialCardsCount = { events: 0, landmarks: 0, projects: 0, ways: 0 };

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() readonly change: EventEmitter<SpecialCardsCount> = new EventEmitter<
        SpecialCardsCount
    >();

    formGroup: FormGroup = new FormGroup({});
}
