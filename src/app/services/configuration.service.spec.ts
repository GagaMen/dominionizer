import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { CardService } from './card.service';
import { Configuration } from '../models/configuration';
import { CardTypeId } from '../models/card-type';
import { cold } from 'jasmine-marbles';
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

    describe('updateEditions', () => {
        it('should update configuration.editions', () => {
            const editions = dataFixture.createEditions();
            const expected$ = cold('a', {
                a: { ...ConfigurationService.defaultConfiguration, editions: editions },
            });

            configurationService.updateEditions(editions);
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
            const expected$ = cold('a', { a: expected });

            configurationService.updateSpecialCardsCount(count);
            const actual$ = configurationService.configuration$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('isCardTypeAvailable', () => {
        it('with enabled edition has card with given card type should return true', () => {
            const editions = dataFixture.createEditions();
            const enabledEditions = editions.slice(1);
            const cardType = dataFixture.createCardType();
            const card = dataFixture.createCard({ editions: editions, types: [cardType] });
            const findByCardType$ = cold('a', { a: [card] });
            const expected$ = cold('      a', { a: true });
            cardServiceSpy.findByCardType
                .withArgs(cardType.id as CardTypeId)
                .and.returnValue(findByCardType$);
            configurationService.updateEditions(enabledEditions);

            const actual$ = configurationService.isCardTypeAvailable(cardType.id as CardTypeId);

            expect(actual$).toBeObservable(expected$);
        });

        it('with enabled edition has no card with given card type should return false', () => {
            const editions = dataFixture.createEditions();
            const enabledEditions = editions.slice(0, 1);
            const cardEditions = editions.slice(1);
            const cardType = dataFixture.createCardType();
            const card = dataFixture.createCard({ editions: cardEditions, types: [cardType] });
            const findByCardType$ = cold('a', { a: [card] });
            const expected$ = cold('      a', { a: false });
            cardServiceSpy.findByCardType
                .withArgs(cardType.id as CardTypeId)
                .and.returnValue(findByCardType$);
            configurationService.updateEditions(enabledEditions);

            const actual$ = configurationService.isCardTypeAvailable(cardType.id as CardTypeId);

            expect(actual$).toBeObservable(expected$);
        });
    });
});
