import { CardType } from '../../../../../src/app/models/card-type';
import { CardTypeValidator } from './card-type-validators';
import { ValidationResult } from './validation-result';

describe('CardTypeValidator', () => {
    const validator = new CardTypeValidator();

    describe('validateFromCargo', () => {
        it('with valid card type should return Success', () => {
            const cardType: CardType = {
                id: '241',
                name: 'Action',
                scope: 'Card',
            };

            const actual = validator.validateFromCargo(cardType);

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with invalid card type should return Failure', () => {
            const cardType: CardType = { id: '241', name: '', scope: '' };
            const expected = ValidationResult.Failure(
                'Card type (ID: 241, Name: ""):\n' +
                    '"name" is not allowed to be empty\n' +
                    '"scope" is not allowed to be empty',
            );

            const actual = validator.validateFromCargo(cardType);

            expect(actual).toEqual(expected);
        });
    });
});
