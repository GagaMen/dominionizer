import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { CardService } from './card.service';
import { Configuration } from '../models/configuration';
import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { SpyObj } from 'src/testing/spy-obj';
import { DataFixture } from 'src/testing/data-fixture';

describe('ConfigurationService', () => {
    let configurationService: ConfigurationService;
    let cardServiceSpy: SpyObj<CardService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ConfigurationService,
                {
                    provide: CardService,
                    useValue: jasmine.createSpyObj<CardService>('CardService', ['findByCardType']),
                },
            ],
        });

        dataFixture = new DataFixture();
        cardServiceSpy = TestBed.inject(CardService) as jasmine.SpyObj<CardService>;
        configurationService = TestBed.inject(ConfigurationService);
    });

    describe('configuration$', () => {
        it('with service just initialized should emit default configuration', () => {
            const expected$ = cold('a', { a: ConfigurationService.defaultConfiguration });

            const actual$ = configurationService.configuration$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('updateExpansions', () => {
        it('should update configuration.expansions', () => {
            const expansions = dataFixture.createExpansions();
            const expected$: Observable<Configuration> = cold('a', {
                a: { ...ConfigurationService.defaultConfiguration, expansions: expansions },
            });

            configurationService.updateExpansions(expansions);
            const actual$ = configurationService.configuration$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('updateSpecialCardsCount', () => {
        it('should update configuration.specialCardsCount', () => {
            const count = dataFixture.createSpecialCardsCount();
            const expected: Configuration = {
                ...ConfigurationService.defaultConfiguration,
                specialCardsCount: count,
            };
            const expected$: Observable<Configuration> = cold('a', { a: expected });

            configurationService.updateSpecialCardsCount(count);
            const actual$ = configurationService.configuration$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('isCardTypeAvailable', () => {
        it('with enabled expansion has card with given card type should return true', () => {
            const expansions = dataFixture.createExpansions();
            const enabledExpansions = expansions.slice(1);
            const cardType = dataFixture.createCardType();
            const card = dataFixture.createCard({ expansions: expansions, types: [cardType] });
            const findByCardType$ = cold('a', { a: [card] });
            const expected$ = cold('      a', { a: true });
            cardServiceSpy.findByCardType.withArgs(cardType).and.returnValue(findByCardType$);
            configurationService.updateExpansions(enabledExpansions);

            const actual$ = configurationService.isCardTypeAvailable(cardType);

            expect(actual$).toBeObservable(expected$);
        });

        it('with enabled expansion has no card with given card type should return false', () => {
            const expansions = dataFixture.createExpansions();
            const enabledExpansions = expansions.slice(0, 1);
            const cardExpansions = expansions.slice(1);
            const cardType = dataFixture.createCardType();
            const card = dataFixture.createCard({ expansions: cardExpansions, types: [cardType] });
            const findByCardType$ = cold('a', { a: [card] });
            const expected$ = cold('      a', { a: false });
            cardServiceSpy.findByCardType.withArgs(cardType).and.returnValue(findByCardType$);
            configurationService.updateExpansions(enabledExpansions);

            const actual$ = configurationService.isCardTypeAvailable(cardType);

            expect(actual$).toBeObservable(expected$);
        });
    });
});
