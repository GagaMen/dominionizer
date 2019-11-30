import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { Configuration } from '../models/configuration';
import { Options } from '../models/options';
import { ShuffleService } from '../services/shuffle.service';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../services/configuration.service';
import { CardType } from '../models/card-type';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
  ]
})
export class ConfigurationComponent implements OnInit {
  secondStep: FormGroup = null;
  areEventsAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Event);
  areLandmarksAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Landmark);
  areBoonsAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Boon);
  areHexesAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Hex);
  areStatesAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.State);

  constructor(
    public configurationService: ConfigurationService,
    private shuffleService: ShuffleService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildSecondStep();
  }

  private buildSecondStep() {
    this.secondStep = this.formBuilder.group({
      events: new FormControl(0),
      landmarks: new FormControl(0),
      boons: new FormControl(0),
      hexes: new FormControl(0),
      states: new FormControl(0),
    });
  }

  onSubmit() {
    this.shuffleService.configuration = this.determineConfiguration();
    this.router.navigate(['result']);
  }

  // TODO: Should be correct inconsistent configuration state
  //       - e.g. select "Adventures" -> select "2" for Events -> unselect "Adventures" -> FormGroup still contains "2" for Events
  private determineConfiguration(): Configuration {
    return { expansions: [], options: this.determineOptions() };
  }

  private determineOptions(): Options {
    return this.secondStep.value;
  }
}
