import { Edition } from '../../../../../src/app/models/edition';
import { EditionValidator } from './edition-validators';
import { ValidationResult } from './validation-result';

describe('EditionValidator', () => {
    const validator = new EditionValidator();

    describe('validate', () => {
        it('with valid edition should return Success', () => {
            const edition: Edition = {
                id: '301',
                expansion: 'Dominion',
                edition: '1',
                icon: 'Dominion_icon.png',
            };

            const actual = validator.validate(edition);

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with invalid edition should return Failure', () => {
            const edition: Edition = {
                id: '301',
                expansion: '',
                edition: '',
                icon: '',
            };
            const expected = ValidationResult.Failure(
                'Edition (ID: 301, Expansion: ""):\n' +
                    '"expansion" is not allowed to be empty\n' +
                    '"edition" is not allowed to be empty\n' +
                    '"icon" is not allowed to be empty',
            );

            const actual = validator.validate(edition);

            expect(actual).toEqual(expected);
        });
    });
});
