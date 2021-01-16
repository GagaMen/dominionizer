import { AppBarService } from './../../services/app-bar.service';
import { Component, OnInit } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ExpansionService } from 'src/app/services/expansion.service';
import { combineLatest, Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { map } from 'rxjs/operators';
import { CardType } from 'src/app/models/card-type';
import { SpecialCardsAvailability } from 'src/app/models/special-cards-availability';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    providers: [{ provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }],
})
export class ConfigurationComponent implements OnInit {
    specialCardsAvailability$: Observable<SpecialCardsAvailability> = new Observable();

    constructor(
        private appBarService: AppBarService,
        public expansionService: ExpansionService,
        public configurationService: ConfigurationService,
    ) {}

    ngOnInit(): void {
        this.appBarService.updateConfiguration({
            navigationAction: 'none',
            actions: [],
        });
        this.specialCardsAvailability$ = combineLatest(
            this.configurationService.isCardTypeAvailable(CardType.Event),
            this.configurationService.isCardTypeAvailable(CardType.Landmark),
            this.configurationService.isCardTypeAvailable(CardType.Project),
            this.configurationService.isCardTypeAvailable(CardType.Way),
        ).pipe(
            map(([events, landmarks, projects, ways]) => {
                return {
                    events: events,
                    landmarks: landmarks,
                    projects: projects,
                    ways: ways,
                } as SpecialCardsAvailability;
            }),
        );
    }
}
