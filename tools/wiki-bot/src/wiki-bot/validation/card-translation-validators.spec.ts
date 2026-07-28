import { CardTranslation } from './../../../../../src/app/models/card';
import { CargoCard } from './../wiki-client/api-models';
import { CardTranslationValidator } from './card-translation-validators';
import { ValidationResult } from './validation-result';

describe('CardTranslationValidator', () => {
    const validator = new CardTranslationValidator();

    describe('validate', () => {
        const cargoCard = { Name: 'Cellar' } as CargoCard;

        it('with valid card translation should return Success', () => {
            const cardTranslation: CardTranslation = {
                id: '5293',
                name: 'Keller',
                description: "'''+1 Aktion'''<br>Lege...",
            };

            const actual = validator.validate(cardTranslation, 'German', cargoCard);

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with empty description should return Success', () => {
            const cardTranslation: CardTranslation = {
                id: '5293',
                name: 'Keller',
                description: '',
            };

            const actual = validator.validate(cardTranslation, 'German', cargoCard);

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with invalid card translation should return Failure', () => {
            const cardTranslation: CardTranslation = {
                id: '5293',
                name: undefined,
                description: undefined,
            } as unknown as CardTranslation;
            const expected = ValidationResult.Failure(
                'Card translation (Name: "Cellar", Language: "German"):\n' +
                    '"name" is required\n' +
                    '"description" is required',
            );

            const actual = validator.validate(cardTranslation, 'German', cargoCard);

            expect(actual).toEqual(expected);
        });
    });
});
