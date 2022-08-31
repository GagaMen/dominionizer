import { CardType } from '../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { CardTypeValidator } from './card-type-validators';
import { ValidationResult } from './validation-result';

describe('card type validators', () => {
    describe('CardTypeValidator', () => {
        const validator = new CardTypeValidator();

        describe('validate', () => {
            const cardTypePage: CardTypePage = {
                pageid: 1,
                title: 'Action',
            } as CardTypePage;

            it('with valid card type should return Success', () => {
                const cardType: CardType = {
                    id: 1,
                    name: 'Action',
                };

                const actual = validator?.validate(cardType, cardTypePage);

                expect(actual).toEqual(ValidationResult.Success);
            });

            it('with invalid card type should return Failure', () => {
                const cardType: CardType = { id: 1, name: '' };
                const expected = ValidationResult.Failure(
                    'Card type (Name: "Action"):\n' + '"name" is not allowed to be empty',
                );

                const actual = validator?.validate(cardType, cardTypePage);

                expect(actual).toEqual(expected);
            });
        });
    });
});
