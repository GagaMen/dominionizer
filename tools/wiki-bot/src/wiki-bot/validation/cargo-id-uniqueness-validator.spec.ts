import { buildCargoEditionId, buildCargoId } from '../builder/cargo-id';
import { CargoCard, CargoEdition } from '../wiki-client/api-models';
import { CargoIdUniquenessValidator } from './cargo-id-uniqueness-validator';
import { ValidationResult } from './validation-result';

describe('CargoIdUniquenessValidator', () => {
    const validator = new CargoIdUniquenessValidator();

    const cargoCard = (PageId: string): CargoCard => ({ PageId }) as unknown as CargoCard;
    const cargoEdition = (PageId: string, Edition: string): CargoEdition =>
        ({ PageId, Edition }) as unknown as CargoEdition;

    describe('validate', () => {
        it('with unique ids should return Success', () => {
            const cargoCards: CargoCard[] = [cargoCard('11442'), cargoCard('8442')];

            const actual = validator.validate(cargoCards, buildCargoId, 'headline');

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with duplicate ids should return Failure naming the id and its count', () => {
            const cargoCards: CargoCard[] = [
                cargoCard('11442'),
                cargoCard('8442'),
                cargoCard('11442'),
            ];
            const expected = ValidationResult.Failure(
                'Following card ids are not unique:\n11442 (2 times)',
            );

            const actual = validator.validate(
                cargoCards,
                buildCargoId,
                'Following card ids are not unique:',
            );

            expect(actual).toEqual(expected);
        });

        it('with editions sharing a page should return Success', () => {
            const cargoEditions: CargoEdition[] = [
                cargoEdition('1101', '2'),
                cargoEdition('1101', '1'),
            ];

            const actual = validator.validate(cargoEditions, buildCargoEditionId, 'headline');

            expect(actual).toEqual(ValidationResult.Success);
        });
    });
});
