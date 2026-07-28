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
                PageId: '148',
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

        it('with spaces in icon should replace them by underscores', () => {
            const cargoEdition: CargoEdition = {
                Id: '296',
                PageId: '296',
                Expansion: 'Seaside',
                Edition: '1',
                Icon: 'Seaside old icon.png',
            };

            const actual = editionBuilder.build(cargoEdition);

            expect(actual.icon).toBe('Seaside_old_icon.png');
        });

        it('with disambiguated icon should remove the "(expansion)" suffix', () => {
            const cargoEdition: CargoEdition = {
                Id: '286',
                PageId: '286',
                Expansion: 'Plunder',
                Edition: '1',
                Icon: 'Plunder (expansion) icon.png',
            };

            const actual = editionBuilder.build(cargoEdition);

            expect(actual.icon).toBe('Plunder_icon.png');
        });
    });
});
