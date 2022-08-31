import { ExpansionTranslation } from '../../../../../src/app/models/expansion';
import { ExpansionPage } from '../wiki-client/api-models';
import { ExpansionTranslationValidator } from './expansion-translation-validators';
import { ValidationResult } from './validation-result';

describe('expansion translation validators', () => {
    describe('ExpansionTranslationValidator', () => {
        const validator = new ExpansionTranslationValidator();

        describe('validate', () => {
            const expansionPage: ExpansionPage = {
                pageid: 1,
                title: 'Dominion',
            } as ExpansionPage;

            it('with valid expansion translation should return Success', () => {
                const expansionTranslation: ExpansionTranslation = {
                    id: 1,
                    name: 'Dominion',
                };

                const actual = validator?.validate(expansionTranslation, 'German', expansionPage);

                expect(actual).toEqual(ValidationResult.Success);
            });

            it('with invalid expansion translation should return Failure', () => {
                const expansionTranslation: ExpansionTranslation = { id: 1, name: '' };
                const expected = ValidationResult.Failure(
                    'Expansion translation (Name: "Dominion", Language: "German"):\n' +
                        '"name" is not allowed to be empty',
                );

                const actual = validator?.validate(expansionTranslation, 'German', expansionPage);

                expect(actual).toEqual(expected);
            });
        });
    });
});
