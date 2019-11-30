import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DataService } from '../services/data.service';
import { Expansion } from '../models/expansion';
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
  firstStep: FormGroup = null;
  secondStep: FormGroup = null;
  expansions: Expansion[];
  areEventsAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Event);
  areLandmarksAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Landmark);
  areBoonsAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Boon);
  areHexesAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.Hex);
  areStatesAvailable$: Observable<boolean> = this.configurationService.isCardTypeAvailable(CardType.State);

  constructor(
    public configurationService: ConfigurationService,
    private dataService: DataService,
    private shuffleService: ShuffleService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  private static validateMinSelect(control: FormArray): ValidationErrors | null {
    const controlValues = Object.values(control.value);
    const result = controlValues.reduce((previousValue: boolean, currentValue: boolean) => previousValue || currentValue);
    return result ? null : { minSelect: { value: control.value } };
  }

  ngOnInit() {
    this.dataService.expansions().subscribe((expansions: Expansion[]) => {
      this.expansions = expansions;

      this.buildFirstStep(expansions);
      this.buildSecondStep();
      this.onChange();
    });
  }

  private buildFirstStep(expansions: Expansion[]) {
    this.firstStep = this.formBuilder.group({
      expansions: new FormArray(expansions.map(() => new FormControl(false)), ConfigurationComponent.validateMinSelect),
      selectAll: new FormControl(false),
    });
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

  onChange(): void {
    this.firstStep.get('selectAll').valueChanges.subscribe(bool => {
      const expansions = this.firstStep.get('expansions') as FormArray;
      expansions.patchValue(Array(expansions.length).fill(bool), { emitEvent: false });
    });

    this.firstStep.get('expansions').valueChanges.subscribe(val => {
        const allSelected = val.every(bool => bool);
        if (this.firstStep.get('selectAll').value !== allSelected) {
          this.firstStep.get('selectAll').patchValue(allSelected, { emitEvent: false });
        }
    });

    this.firstStep.get('expansions').valueChanges.subscribe((expansionStates: boolean[]) => {
      const enabledExpansions = this.expansions.filter((_, index: number) => expansionStates[index] === true);
      this.configurationService.updateExpansions(enabledExpansions);
    });
  }

  onSubmit() {
    this.shuffleService.configuration = this.determineConfiguration();
    this.router.navigate(['result']);
  }

  // TODO: Should be correct inconsistent configuration state
  //       - e.g. select "Adventures" -> select "2" for Events -> unselect "Adventures" -> FormGroup still contains "2" for Events
  private determineConfiguration(): Configuration {
    return { expansions: this.determineExpansions(), options: this.determineOptions() };
  }

  private determineExpansions(): Expansion[] {
    return this.expansions.filter((expansion: Expansion, index: number) => this.firstStep.get('expansions').value[index]);
  }

  private determineOptions(): Options {
    return this.secondStep.value;
  }
}
