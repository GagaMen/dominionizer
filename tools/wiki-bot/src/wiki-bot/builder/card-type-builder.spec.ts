import { CardType } from './../../../../../src/app/models/card-type';
import { CargoCardType } from './../wiki-client/api-models';
import { CardTypeBuilder } from './card-type-builder';

describe('CardTypeBuilder', () => {
    let cardTypeBuilder: CardTypeBuilder;

    beforeEach(() => {
        cardTypeBuilder = new CardTypeBuilder();
    });

    describe('build', () => {
        it('should return correct card type', () => {
            const cargoCardType: CargoCardType = {
                Id: '119',
                Name: 'Landmark',
                Scope: 'Landscape',
            };
            const expected: CardType = {
                id: '119',
                name: 'Landmark',
                scope: 'Landscape',
            };

            const actual = cardTypeBuilder.build(cargoCardType);

            expect(actual).toEqual(expected);
        });
    });
});
