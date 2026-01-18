import { CardType, CardTypeV2 } from './../../../../../src/app/models/card-type';
import { CardTypePage, CargoCardType } from './../wiki-client/api-models';
import { CardTypeBuilder } from './card-type-builder';

describe('CardTypeBuilder', () => {
    let cardTypeBuilder: CardTypeBuilder;

    beforeEach(() => {
        cardTypeBuilder = new CardTypeBuilder();
    });

    describe('build', () => {
        it('should return correct card type', () => {
            const cardTypePage: CardTypePage = {
                pageid: 1,
                title: 'Card Type Name',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Knight',
                revisions: [{ '*': 'wiki text of card type' }],
            };
            const expected: CardType = {
                id: cardTypePage.pageid,
                name: cardTypePage.title,
            };

            const actual = cardTypeBuilder.build(cardTypePage);

            expect(actual).toEqual(expected);
        });
    });

    describe('buildFromCargo', () => {
        it('should return correct card type', () => {
            const cargoCardType: CargoCardType = {
                Id: '119',
                Name: 'Landmark',
                Scope: 'Landscape',
            };
            const expected: CardTypeV2 = {
                id: '119',
                name: 'Landmark',
                scope: 'Landscape',
            };

            const actual = cardTypeBuilder.buildFromCargo(cargoCardType);

            expect(actual).toEqual(expected);
        });
    });
});
