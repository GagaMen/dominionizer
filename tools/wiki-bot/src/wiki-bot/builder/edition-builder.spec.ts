import { Edition } from 'src/app/models/edition';
import { CargoEdition } from '../wiki-client/api-models';
import { EditionBuilder } from './edition-builder';

describe('EditionBuilder', () => {
    let editionBuilder: EditionBuilder;

    beforeEach(() => {
        editionBuilder = new EditionBuilder();
    });

    describe('build', () => {
        it('should return expansion', () => {
            const cargoEdition: CargoEdition = {
                Id: '148',
                Expansion: 'Promo',
                Edition: '1',
                Icon: 'Promo_icon.png',
            };
            const expected: Edition = {
                id: '148',
                expansion: 'Promo',
                edition: '1',
                icon: 'Promo_icon.png',
            };

            const actual = editionBuilder.build(cargoEdition);

            expect(actual).toEqual(expected);
        });
    });
});
