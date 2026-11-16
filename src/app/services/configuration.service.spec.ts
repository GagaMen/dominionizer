import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { CardService } from './card.service';
import { Configuration } from '../models/configuration';
import { CardTypeId } from '../models/card-type';
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

    describe('configuration', () => {
        it('with service just initialized should return default configuration', () => {
            const expected = ConfigurationService.defaultConfiguration;

            const actual = configurationService.configuration();

            expect(actual).toEqual(expected);
        });
    });

    describe('updateEditions', () => {
        it('should update configuration.editions', () => {
            const editions = dataFixture.createEditions();
            const expected: Configuration = {
                ...ConfigurationService.defaultConfiguration,
                editions: editions,
            };

            configurationService.updateEditions(editions);
            const actual = configurationService.configuration();

            expect(actual).toEqual(expected);
        });
    });

    describe('updateSpecialCardsCount', () => {
        it('should update configuration.specialCardsCount', () => {
            const count = dataFixture.createSpecialCardsCount();
            const expected: Configuration = {
                ...ConfigurationService.defaultConfiguration,
                specialCardsCount: count,
            };

            configurationService.updateSpecialCardsCount(count);
            const actual = configurationService.configuration();

            expect(actual).toEqual(expected);
        });
    });

    describe('isCardTypeAvailable', () => {
        it('with enabled edition has card with given card type should return true', () => {
            const editions = dataFixture.createEditions();
            const enabledEditions = editions.slice(1);
            const cardType = dataFixture.createCardType();
            const card = dataFixture.createCard({ editions: editions, types: [cardType] });
            cardServiceSpy.findByCardType
                .withArgs(cardType.id as CardTypeId)
                .and.returnValue([card]);
            configurationService.updateEditions(enabledEditions);

            const actual = configurationService.isCardTypeAvailable(cardType.id as CardTypeId);

            expect(actual).toBe(true);
        });

        it('with enabled edition is a different instance of the same edition should return true', () => {
            const edition = dataFixture.createEdition();
            const cardType = dataFixture.createCardType();
            const card = dataFixture.createCard({ editions: [edition], types: [cardType] });
            cardServiceSpy.findByCardType
                .withArgs(cardType.id as CardTypeId)
                .and.returnValue([card]);
            configurationService.updateEditions([{ ...edition }]);

            const actual = configurationService.isCardTypeAvailable(cardType.id as CardTypeId);

            expect(actual).toBe(true);
        });

        it('with enabled edition has no card with given card type should return false', () => {
            const editions = dataFixture.createEditions();
            const enabledEditions = editions.slice(0, 1);
            const cardEditions = editions.slice(1);
            const cardType = dataFixture.createCardType();
            const card = dataFixture.createCard({ editions: cardEditions, types: [cardType] });
            cardServiceSpy.findByCardType
                .withArgs(cardType.id as CardTypeId)
                .and.returnValue([card]);
            configurationService.updateEditions(enabledEditions);

            const actual = configurationService.isCardTypeAvailable(cardType.id as CardTypeId);

            expect(actual).toBe(false);
        });
    });
});
