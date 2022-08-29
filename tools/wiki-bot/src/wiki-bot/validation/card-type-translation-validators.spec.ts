import { CardTypeTranslationValidator } from './card-type-translation-validators';
import { CardTypeTranslation } from '../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { ValidationResult } from './validation-result';

describe('card type translation validators', () => {
    describe('CardTypeTranslationValidator', () => {
        const validator = new CardTypeTranslationValidator();

        describe('validate', () => {
            const cardTypePage: CardTypePage = {
                pageid: 1,
                title: 'Action',
            } as CardTypePage;

            it('with valid card type translation should return Success', () => {
                const cardTypeTranslation: CardTypeTranslation = {
                    id: 1,
                    name: 'Aktion',
                };

                const actual = validator?.validate(cardTypeTranslation, cardTypePage);

                expect(actual).toEqual(ValidationResult.Success);
            });

            it('with invalid card type translation should return Failure', () => {
                const cardTypeTranslation: CardTypeTranslation = { id: 1, name: '' };
                const expected = ValidationResult.Failure(
                    'Card type translation (ID: 1, Name: "Action"):\n' +
                        '"name" is not allowed to be empty',
                );

                const actual = validator?.validate(cardTypeTranslation, cardTypePage);

                expect(actual).toEqual(expected);
            });
        });
    });
});
