import { CardService } from './../../services/card.service';
import { AppBarService } from './../../services/app-bar.service';
import { Component, OnInit, inject, viewChild } from '@angular/core';
import { EditionService } from 'src/app/services/edition.service';
import { combineLatest, Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { map } from 'rxjs/operators';
import { CardTypeId } from 'src/app/models/card-type';
import { SpecialCardsAvailability } from 'src/app/models/special-cards-availability';
import { SpecialCardsCount } from 'src/app/models/special-cards-count';
import { Edition } from 'src/app/models/edition';
import { Card } from 'src/app/models/card';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFabButton } from '@angular/material/button';
import { SpecialCardSelectComponent } from '../special-card-select/special-card-select.component';
import { EditionSelectComponent } from '../edition-select/edition-select.component';
import { AsyncPipe } from '@angular/common';
import { MatStepper, MatStep, MatStepLabel } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

export interface EditionSelectViewData {
    editions: Edition[];
    initialValue: Edition[];
}

export interface SpecialCardSelectViewData {
    initialValue: SpecialCardsCount;
    availability: SpecialCardsAvailability;
}

@Component({
    selector: 'app-configuration',
    imports: [
        EditionSelectComponent,
        SpecialCardSelectComponent,
        MatStepper,
        MatStep,
        MatStepLabel,
        MatFabButton,
        MatIcon,
        AsyncPipe,
    ],
    providers: [{ provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }],
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
    private appBarService = inject(AppBarService);
    private router = inject(Router);
    editionService = inject(EditionService);
    configurationService = inject(ConfigurationService);
    cardService = inject(CardService);

    private readonly editionSelect = viewChild.required(EditionSelectComponent);

    editionSelectViewData$ = new Observable<EditionSelectViewData>();
    specialCardSelectViewData$ = new Observable<SpecialCardSelectViewData | null>();

    ngOnInit(): void {
        this.appBarService.updateConfiguration({
            navigationAction: 'none',
            actions: [],
        });
        this.initEditionSelectViewData();
        this.initSpecialCardSelectViewData();
    }

    navigateToSet(): void {
        const editionSelect = this.editionSelect();

        if (editionSelect.formGroup.invalid) {
            editionSelect.showValidationError();
            return;
        }

        void this.router.navigate(['/set']);
    }

    private initEditionSelectViewData(): void {
        this.editionSelectViewData$ = combineLatest([
            this.editionService.editions$,
            this.configurationService.configuration$,
            this.cardService.cards$,
        ]).pipe(
            map(([editions, configuration, cards]) => {
                // remove editions which do not have cards yet
                const editionsWithCards = editions.filter((edition: Edition) =>
                    Array.from(cards.values()).some((card: Card) =>
                        card.editions.some((cardEdition: Edition) => cardEdition.id === edition.id),
                    ),
                );

                const viewData: EditionSelectViewData = {
                    editions: editionsWithCards,
                    initialValue: configuration.editions,
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
