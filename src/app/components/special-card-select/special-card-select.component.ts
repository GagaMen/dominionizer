import { SpecialCardsCount } from '../../models/special-cards-count';
import { SpecialCardsAvailability } from '../../models/special-cards-availability';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-special-card-select',
    templateUrl: './special-card-select.component.html',
    styleUrls: ['./special-card-select.component.scss'],
})
export class SpecialCardSelectComponent implements OnInit {
    @Input() availability: SpecialCardsAvailability = {
        events: false,
        landmarks: false,
        projects: false,
        ways: false,
    };

    @Input() initialValue: SpecialCardsCount = { events: 0, landmarks: 0, projects: 0, ways: 0 };

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output()
    readonly change: EventEmitter<SpecialCardsCount> = new EventEmitter<SpecialCardsCount>();

    formGroup: FormGroup = new FormGroup({});

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            events: [this.initialValue.events],
            landmarks: [this.initialValue.landmarks],
            projects: [this.initialValue.projects],
            ways: [this.initialValue.ways],
        });

        this.formGroup.valueChanges.subscribe((specialCardsCount: SpecialCardsCount) =>
            this.change.emit(specialCardsCount),
        );
    }
}
