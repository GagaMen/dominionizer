import { AppBarService } from './../../services/app-bar.service';
import { Component, OnInit } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ExpansionService } from 'src/app/services/expansion.service';
import { combineLatest, Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { map } from 'rxjs/operators';
import { CardTypeId } from 'src/app/models/card-type';
import { SpecialCardsAvailability } from 'src/app/models/special-cards-availability';
import { SpecialCardsCount } from 'src/app/models/special-cards-count';
import { Expansion } from 'src/app/models/expansion';

export interface ExpansionSelectViewData {
    expansions: Expansion[];
    initialValue: Expansion[];
}

export interface SpecialCardSelectViewData {
    initialValue: SpecialCardsCount;
    availability: SpecialCardsAvailability;
}

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    providers: [{ provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }],
})
export class ConfigurationComponent implements OnInit {
    expansionSelectViewData$: Observable<ExpansionSelectViewData> = new Observable();
    specialCardSelectViewData$: Observable<SpecialCardSelectViewData | null> = new Observable();

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
        this.initExpansionSelectViewData();
        this.initSpecialCardSelectViewData();
    }

    private initExpansionSelectViewData(): void {
        this.expansionSelectViewData$ = combineLatest(
            this.expansionService.expansions$,
            this.configurationService.configuration$,
        ).pipe(
            map(([expansions, configuration]) => {
                const viewData: ExpansionSelectViewData = {
                    expansions: expansions,
                    initialValue: configuration.expansions,
                };
                return viewData;
            }),
        );
    }

    private initSpecialCardSelectViewData(): void {
        this.specialCardSelectViewData$ = combineLatest(
            this.configurationService.configuration$,
            this.configurationService.isCardTypeAvailable(CardTypeId.Event),
            this.configurationService.isCardTypeAvailable(CardTypeId.Landmark),
            this.configurationService.isCardTypeAvailable(CardTypeId.Project),
            this.configurationService.isCardTypeAvailable(CardTypeId.Way),
        ).pipe(
            map(
                ([
                    configuration,
                    areEventsAvailable,
                    areLandmarksAvailable,
                    areProjectsAvailable,
                    areWaysAvailable,
                ]) => {
                    if (
                        !(
                            areEventsAvailable ||
                            areLandmarksAvailable ||
                            areProjectsAvailable ||
                            areWaysAvailable
                        )
                    ) {
                        return null;
                    }

                    const viewData: SpecialCardSelectViewData = {
                        initialValue: configuration.specialCardsCount,
                        availability: {
                            events: areEventsAvailable,
                            landmarks: areLandmarksAvailable,
                            projects: areProjectsAvailable,
                            ways: areWaysAvailable,
                        },
                    };
                    return viewData;
                },
            ),
        );
    }
}
