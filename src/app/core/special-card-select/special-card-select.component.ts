import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigurationService } from '../services/configuration.service';
import { Observable } from 'rxjs/internal/Observable';
import { CardType } from '../models/card-type';

@Component({
  selector: 'app-special-card-select',
  templateUrl: './special-card-select.component.html',
  styleUrls: ['./special-card-select.component.scss']
})
export class SpecialCardSelectComponent {
  @Output() submit: EventEmitter<any> = new EventEmitter();
  formGroup: FormGroup = null;
  areEventsAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Event);
  areLandmarksAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Landmark);
  areBoonsAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Boon);
  areHexesAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Hex);
  areStatesAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.State);

  constructor(
    private configurationService: ConfigurationService,
    private formBuilder: FormBuilder,
  ) {
    this.buildFormGroup();
  }

  private buildFormGroup() {
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
  onNgSubmit() {
    this.submit.emit();
  }
}
