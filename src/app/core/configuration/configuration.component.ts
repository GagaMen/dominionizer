import { ShuffleService } from './../services/shuffle.service';
import { ConfigurationService } from './../services/configuration.service';
import { Component } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { Configuration } from '../models/configuration';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
  ]
})
export class ConfigurationComponent {

  constructor(
    private router: Router,
    private configurationService: ConfigurationService,
    private shuffleService: ShuffleService
  ) {
    this.configurationService.configuration$.subscribe(
      (configuration: Configuration) => this.shuffleService.configuration = configuration
    );
  }

  onSubmit() {
    this.router.navigate(['result']);
  }
}
