import { CardTranslation } from './../../../../../src/app/models/card';
import { CardPage } from './../wiki-client/api-models';
import { CardTranslationValidator } from './card-translation-validators';
import { ValidationResult } from './validation-result';

describe('card translation validators', () => {
    describe('CardTranslationValidator', () => {
        const validator = new CardTranslationValidator();

        describe('validate', () => {
            const cardPage: CardPage = {
                pageid: 1,
                title: 'Cellar',
            } as CardPage;

            it('with valid card translation should return Success', () => {
                const cardTranslation: CardTranslation = {
                    id: 1,
                    name: 'Keller',
                    description: "'''+1 Aktion'''<br>Lege...",
                };

                const actual = validator?.validate(cardTranslation, 'German', cardPage);

                expect(actual).toEqual(ValidationResult.Success);
            });

            it('with empty card translation should return Success', () => {
                const cardTranslation: CardTranslation = {
                    id: 1,
                    name: '',
                    description: '',
                };

                const actual = validator?.validate(cardTranslation, 'German', cardPage);

                expect(actual).toEqual(ValidationResult.Success);
            });

            it('with invalid card translation should return Failure', () => {
                const cardTranslation: CardTranslation = ({
                    id: 1,
                    name: undefined,
                    description: undefined,
                } as unknown) as CardTranslation;
                const expected = ValidationResult.Failure(
                    'Card translation (Name: "Cellar", Language: "German"):\n' +
                        '"name" is required\n' +
                        '"description" is required',
                );

                const actual = validator?.validate(cardTranslation, 'German', cardPage);

                expect(actual).toEqual(expected);
            });
        });
    });
});
