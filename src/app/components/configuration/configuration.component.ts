import { CardService } from './../../services/card.service';
import { AppBarService } from './../../services/app-bar.service';
import {
    Component,
    OnInit,
    inject,
    viewChild,
    ChangeDetectionStrategy,
    computed,
} from '@angular/core';
import { EditionService } from 'src/app/services/edition.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
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
    ],
    providers: [{ provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }],
    templateUrl: './configuration.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
    private appBarService = inject(AppBarService);
    private router = inject(Router);
    editionService = inject(EditionService);
    configurationService = inject(ConfigurationService);
    cardService = inject(CardService);

    private readonly editionSelect = viewChild.required(EditionSelectComponent);

    private readonly editionsWithCards = computed(() => {
        const cards = Array.from(this.cardService.cards.values());

        // remove editions which do not have cards yet
        return this.editionService.editions.filter((edition: Edition) =>
            cards.some((card: Card) =>
                card.editions.some((cardEdition: Edition) => cardEdition.id === edition.id),
            ),
        );
    });

    readonly editionSelectViewData = computed<EditionSelectViewData>(() => ({
        editions: this.editionsWithCards(),
        initialValue: this.configurationService.configuration().editions,
    }));

    readonly specialCardSelectViewData = computed<SpecialCardSelectViewData | null>(() => {
        const availability: SpecialCardsAvailability = {
            events: this.configurationService.isCardTypeAvailable(CardTypeId.Event),
            landmarks: this.configurationService.isCardTypeAvailable(CardTypeId.Landmark),
            projects: this.configurationService.isCardTypeAvailable(CardTypeId.Project),
            ways: this.configurationService.isCardTypeAvailable(CardTypeId.Way),
            traits: this.configurationService.isCardTypeAvailable(CardTypeId.Trait),
        };

        if (!Object.values(availability).some((isAvailable: boolean) => isAvailable)) {
            return null;
        }

        return {
            initialValue: this.configurationService.configuration().specialCardsCount,
            availability,
        };
    });

    ngOnInit(): void {
        this.appBarService.updateConfiguration({
            navigationAction: 'none',
            actions: [],
        });
    }

    navigateToSet(): void {
        const editionSelect = this.editionSelect();

        if (editionSelect.formGroup.invalid) {
            editionSelect.showValidationError();
            return;
        }

        void this.router.navigate(['/set']);
    }
}
