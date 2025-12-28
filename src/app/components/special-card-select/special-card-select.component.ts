import { SpecialCardsCount } from '../../models/special-cards-count';
import { SpecialCardsAvailability } from '../../models/special-cards-availability';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-special-card-select',
    imports: [MatSlider, MatSliderThumb, ReactiveFormsModule, NgIf],
    templateUrl: './special-card-select.component.html',
    styleUrls: ['./special-card-select.component.scss'],
})
export class SpecialCardSelectComponent implements OnInit {
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

    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            events: [this.initialValue.events],
            landmarks: [this.initialValue.landmarks],
            projects: [this.initialValue.projects],
            ways: [this.initialValue.ways],
            traits: [this.initialValue.traits],
        });

        this.formGroup.valueChanges.subscribe((specialCardsCount: SpecialCardsCount) =>
            this.valueChange.emit(specialCardsCount),
        );
    }
}
