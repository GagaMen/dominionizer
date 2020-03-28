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
    areBoonsAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(
        CardType.Boon,
    );
    areHexesAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(
        CardType.Hex,
    );
    areStatesAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(
        CardType.State,
    );

    constructor(
        private configurationService: ConfigurationService,
        private formBuilder: FormBuilder,
    ) {
        this.buildFormGroup();
    }

    private buildFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            events: [0],
            landmarks: [0],
            boons: [0],
            hexes: [0],
            states: [0],
        });
    }

    // TODO: Should be correct inconsistent configuration state
    //       - e.g. select "Adventures" -> select "2" for Events -> unselect "Adventures" -> FormGroup still contains "2" for Events
    onNgSubmit(): void {
        const specialCardStates = this.formGroup.value;
        const options: Options = {
            events: specialCardStates.events,
            landmarks: specialCardStates.landmarks,
            boons: specialCardStates.boons,
            hexes: specialCardStates.hexes,
            states: specialCardStates.states,
        };
        this.configurationService.updateOptions(options);

        this.submitForm.emit();
    }
}
