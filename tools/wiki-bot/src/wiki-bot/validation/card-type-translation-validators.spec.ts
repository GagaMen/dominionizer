import { CardTypeTranslationValidator } from './card-type-translation-validators';
import { CardTypeId, CardTypeTranslation } from '../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { ValidationResult } from './validation-result';

describe('card type translation validators', () => {
    describe('CardTypeTranslationValidator', () => {
        const validator = new CardTypeTranslationValidator();

        describe('validate', () => {
            const cardTypePage: CardTypePage = {
                pageid: CardTypeId.Action,
                title: 'Action',
            } as CardTypePage;

            it('with valid card type translation should return Success', () => {
                const cardTypeTranslation: CardTypeTranslation = {
                    id: CardTypeId.Action,
                    name: 'Aktion',
                };

                const actual = validator?.validate(cardTypeTranslation, 'German', cardTypePage);

                expect(actual).toEqual(ValidationResult.Success);
            });

            it('with invalid card type translation should return Failure', () => {
                const cardTypeTranslation: CardTypeTranslation = {
                    id: CardTypeId.Action,
                    name: '',
                };
                const expected = ValidationResult.Failure(
                    'Card type translation (Name: "Action", Language: "German"):\n' +
                        '"name" is not allowed to be empty',
                );

                const actual = validator?.validate(cardTypeTranslation, 'German', cardTypePage);

                expect(actual).toEqual(expected);
            });
        });
    });
});
