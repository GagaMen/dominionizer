import { TestBed } from '@angular/core/testing';
import { DataFixture } from 'src/testing/data-fixture';
import { injectSpy, SpyObj } from 'src/testing/spy-obj';
import { CardType } from '../models/card-type';

import { CardTypeService } from './card-type.service';
import { DataService } from './data.service';

describe('CardTypeService', () => {
    let cardTypeService: CardTypeService;
    let dataServiceSpy: SpyObj<DataService>;
    let dataFixture: DataFixture;
    let cardTypes: CardType[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: {
                        getCardTypes: vi.fn(),
                        getCardTypeTranslations: vi.fn(),
                    },
                },
            ],
        });

        dataFixture = new DataFixture();
        cardTypes = dataFixture.createCardTypes();

        dataServiceSpy = injectSpy(DataService);
        dataServiceSpy.getCardTypes.mockReturnValue(cardTypes);
        dataServiceSpy.getCardTypeTranslations.mockReturnValue([]);
    });

    describe('cardTypes', () => {
        it('without translations should return source locale data', () => {
            const expected = cardTypes;
            cardTypeService = TestBed.inject(CardTypeService);

            const actual = cardTypeService.cardTypes;

            expect(actual).toEqual(expected);
        });

        it('with translations should return correct translated data', () => {
            const cardTypeTranslations = dataFixture.createCardTypeTranslations(2);
            dataServiceSpy.getCardTypeTranslations.mockReturnValue(cardTypeTranslations);
            const expected = [
                { ...cardTypes[0], name: cardTypeTranslations[0].name },
                { ...cardTypes[1], name: cardTypeTranslations[1].name },
                cardTypes[2],
            ];
            cardTypeService = TestBed.inject(CardTypeService);

            const actual = cardTypeService.cardTypes;

            expect(actual).toEqual(expected);
        });
    });
});
