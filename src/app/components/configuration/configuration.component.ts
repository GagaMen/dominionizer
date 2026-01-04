import { CardService } from './../../services/card.service';
import { AppBarService } from './../../services/app-bar.service';
import { Component, OnInit, inject } from '@angular/core';
import { ExpansionService } from 'src/app/services/expansion.service';
import { combineLatest, Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { map } from 'rxjs/operators';
import { CardTypeId } from 'src/app/models/card-type';
import { SpecialCardsAvailability } from 'src/app/models/special-cards-availability';
import { SpecialCardsCount } from 'src/app/models/special-cards-count';
import { Expansion } from 'src/app/models/expansion';
import { Card } from 'src/app/models/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatFabButton } from '@angular/material/button';
import { SpecialCardSelectComponent } from '../special-card-select/special-card-select.component';
import { ExpansionSelectComponent } from '../expansion-select/expansion-select.component';
import { AsyncPipe } from '@angular/common';
import { MatStepper, MatStep, MatStepLabel } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

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
    imports: [
        ExpansionSelectComponent,
        SpecialCardSelectComponent,
        MatStepper,
        MatStep,
        MatStepLabel,
        MatFabButton,
        MatIcon,
        AsyncPipe,
        RouterLink,
    ],
    providers: [{ provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }],
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
    private appBarService = inject(AppBarService);
    expansionService = inject(ExpansionService);
    configurationService = inject(ConfigurationService);
    cardService = inject(CardService);

    expansionSelectViewData$ = new Observable<ExpansionSelectViewData>();
    specialCardSelectViewData$ = new Observable<SpecialCardSelectViewData | null>();

    ngOnInit(): void {
        this.appBarService.updateConfiguration({
            navigationAction: 'none',
            actions: [],
        });
        this.initExpansionSelectViewData();
        this.initSpecialCardSelectViewData();
    }

    private initExpansionSelectViewData(): void {
        this.expansionSelectViewData$ = combineLatest([
            this.expansionService.expansions$,
            this.configurationService.configuration$,
            this.cardService.cards$,
        ]).pipe(
            map(([expansions, configuration, cards]) => {
                // remove expansions which do not have cards yet
                const expansionsWithCards = expansions.filter((expansion: Expansion) =>
                    Array.from(cards.values()).some((card: Card) =>
                        card.expansions.some(
                            (cardExpansion: Expansion) => cardExpansion.id === expansion.id,
                        ),
                    ),
                );

                const viewData: ExpansionSelectViewData = {
                    expansions: expansionsWithCards,
                    initialValue: configuration.expansions,
                };

                return viewData;
            }),
        );
    }

    private initSpecialCardSelectViewData(): void {
        this.specialCardSelectViewData$ = combineLatest([
            this.configurationService.configuration$,
            this.configurationService.isCardTypeAvailable(CardTypeId.Event),
            this.configurationService.isCardTypeAvailable(CardTypeId.Landmark),
            this.configurationService.isCardTypeAvailable(CardTypeId.Project),
            this.configurationService.isCardTypeAvailable(CardTypeId.Way),
            this.configurationService.isCardTypeAvailable(CardTypeId.Trait),
        ]).pipe(
            map(
                ([
                    configuration,
                    areEventsAvailable,
                    areLandmarksAvailable,
                    areProjectsAvailable,
                    areWaysAvailable,
                    areTraitsAvailable,
                ]) => {
                    if (
                        !(
                            areEventsAvailable ||
                            areLandmarksAvailable ||
                            areProjectsAvailable ||
                            areWaysAvailable ||
                            areTraitsAvailable
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
                            traits: areTraitsAvailable,
                        },
                    };
                    return viewData;
                },
            ),
        );
    }
}
