import { Options } from '../../models/options';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigurationService } from '../../services/configuration.service';
import { Observable } from 'rxjs/internal/Observable';
import { CardType } from '../../models/card-type';

@Component({
    selector: 'app-special-card-select',
    templateUrl: './special-card-select.component.html',
    styleUrls: ['./special-card-select.component.scss'],
})
export class SpecialCardSelectComponent {
    @Output() submitForm: EventEmitter<never> = new EventEmitter();
    formGroup: FormGroup = new FormGroup({});
    areEventsAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(
        CardType.Event,
    );
    areLandmarksAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(
        CardType.Landmark,
    );
    areProjectsAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(
        CardType.Project,
    );
    areWaysAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(
        CardType.Way,
    );

    constructor(
        private configurationService: ConfigurationService,
        private formBuilder: FormBuilder,
    ) {
        this.buildFormGroup();
        this.initializeResetSliderBehaviour();
    }

    private buildFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            events: [0],
            landmarks: [0],
            projects: [0],
            ways: [0],
        });
    }

    private initializeResetSliderBehaviour(): void {
        this.areEventsAvailable$.subscribe((areEventsAvailable) => {
            if (!areEventsAvailable) {
                this.formGroup.get('events')?.setValue(0);
            }
        });

        this.areLandmarksAvailable$.subscribe((areLandmarksAvailable) => {
            if (!areLandmarksAvailable) {
                this.formGroup.get('landmarks')?.setValue(0);
            }
        });

        this.areProjectsAvailable$.subscribe((areProjectsAvailable) => {
            if (!areProjectsAvailable) {
                this.formGroup.get('projects')?.setValue(0);
            }
        });

        this.areWaysAvailable$.subscribe((areWaysAvailable) => {
            if (!areWaysAvailable) {
                this.formGroup.get('ways')?.setValue(0);
            }
        });
    }

    onNgSubmit(): void {
        const specialCardStates = this.formGroup.value;
        const options: Options = {
            events: specialCardStates.events,
            landmarks: specialCardStates.landmarks,
            projects: specialCardStates.projects,
            ways: specialCardStates.ways,
        };
        this.configurationService.updateOptions(options);

        this.submitForm.emit();
    }
}
