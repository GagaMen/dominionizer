import { CardTypeTranslationV2 } from '../../../../../src/app/models/card-type';
import { CargoCardType } from './../wiki-client/api-models';
import { CardTypeTranslationValidator } from './card-type-translation-validators';
import { ValidationResult } from './validation-result';

describe('CardTypeTranslationValidator', () => {
    const validator = new CardTypeTranslationValidator();

    describe('validateFromCargo', () => {
        const cargoCardType = { Name: 'Action' } as CargoCardType;

        it('with valid card type translation should return Success', () => {
            const cardTypeTranslation: CardTypeTranslationV2 = {
                id: '241',
                name: 'Aktion',
            };

            const actual = validator.validateFromCargo(
                cardTypeTranslation,
                'German',
                cargoCardType,
            );

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with invalid card type translation should return Failure', () => {
            const cardTypeTranslation: CardTypeTranslationV2 = {
                id: '241',
                name: '',
            };
            const expected = ValidationResult.Failure(
                'Card type translation (Name: "Action", Language: "German"):\n' +
                    '"name" is not allowed to be empty',
            );

            const actual = validator.validateFromCargo(
                cardTypeTranslation,
                'German',
                cargoCardType,
            );

            expect(actual).toEqual(expected);
        });
    });
});
