import { EditionTranslation } from '../../../../../src/app/models/edition';
import { CargoEdition } from '../wiki-client/api-models';
import { EditionTranslationValidator } from './edition-translation-validators';
import { ValidationResult } from './validation-result';

describe('EditionTranslationValidator', () => {
    const validator = new EditionTranslationValidator();

    describe('validate', () => {
        const cargoEdition = { PageId: '1', Expansion: 'Dominion' } as CargoEdition;

        it('with valid edition translation should return Success', () => {
            const editionTranslation: EditionTranslation = {
                id: '301',
                expansion: 'Dominion',
            };

            const actual = validator.validate(editionTranslation, 'German', cargoEdition);

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with invalid edition translation should return Failure', () => {
            const editionTranslation: EditionTranslation = {
                id: '301',
                expansion: '',
            };
            const expected = ValidationResult.Failure(
                'Edition translation (Expansion: "Dominion", Language: "German"):\n' +
                    '"expansion" is not allowed to be empty',
            );

            const actual = validator.validate(editionTranslation, 'German', cargoEdition);

            expect(actual).toEqual(expected);
        });
    });
});
