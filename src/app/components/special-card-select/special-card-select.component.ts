import { SpecialCardsCount } from '../../models/special-cards-count';
import { SpecialCardsAvailability } from '../../models/special-cards-availability';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
    selector: 'app-special-card-select',
    templateUrl: './special-card-select.component.html',
    styleUrls: ['./special-card-select.component.scss'],
})
export class SpecialCardSelectComponent implements OnInit, OnChanges {
    @Input() availability: SpecialCardsAvailability = {
        events: false,
        landmarks: false,
        projects: false,
        ways: false,
    };

    @Input() initialValue: SpecialCardsCount = { events: 0, landmarks: 0, projects: 0, ways: 0 };

    formGroup: FormGroup = new FormGroup({});

    constructor(
        private configurationService: ConfigurationService,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.buildFormGroup();
        this.initConfigurationUpdating();
    }

    private buildFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            events: [this.initialValue.events],
            landmarks: [this.initialValue.landmarks],
            projects: [this.initialValue.projects],
            ways: [this.initialValue.ways],
        });
    }

    private initConfigurationUpdating(): void {
        this.formGroup.valueChanges.subscribe((specialCardsCount: SpecialCardsCount) =>
            this.updateSpecialCardsCount(this.availability, specialCardsCount),
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.specialCardsAvailability) {
            this.updateSpecialCardsCount(
                changes.specialCardsAvailability.currentValue,
                this.formGroup.value,
            );
        }
    }

    private updateSpecialCardsCount(
        availability: SpecialCardsAvailability,
        count: SpecialCardsCount,
    ): void {
        this.configurationService.updateSpecialCardsCount({
            events: availability.events ? count.events : 0,
            landmarks: availability.landmarks ? count.landmarks : 0,
            projects: availability.projects ? count.projects : 0,
            ways: availability.ways ? count.ways : 0,
        });
    }
}
