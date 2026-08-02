import { CardType } from '../../../../../src/app/models/card-type';
import { CargoCardType } from '../wiki-client/api-models';
import { CardTypeValidator, CardTypesValidator } from './card-type-validators';
import { ValidationResult } from './validation-result';

describe('CardTypeValidator', () => {
    const validator = new CardTypeValidator();

    describe('validate', () => {
        it('with valid card type should return Success', () => {
            const cardType: CardType = {
                id: '241',
                name: 'Action',
                scope: 'Card',
            };

            const actual = validator.validate(cardType);

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with invalid card type should return Failure', () => {
            const cardType: CardType = { id: '241', name: '', scope: '' };
            const expected = ValidationResult.Failure(
                'Card type (ID: 241, Name: ""):\n' +
                    '"name" is not allowed to be empty\n' +
                    '"scope" is not allowed to be empty',
            );

            const actual = validator.validate(cardType);

            expect(actual).toEqual(expected);
        });
    });
});

describe('CardTypesValidator', () => {
    const validator = new CardTypesValidator();

    const cargoCardType = (PageId: string, Name: string): CargoCardType =>
        ({ PageId, Name }) as unknown as CargoCardType;
    const cardType = (id: string, name: string): CardType => ({ id, name }) as unknown as CardType;

    describe('validate', () => {
        it('with cargo card type that was not generated should return Failure', () => {
            const cargoCardTypes: CargoCardType[] = [
                cargoCardType('241', 'Action'),
                cargoCardType('320', 'Event'),
            ];
            const cardTypes: CardType[] = [cardType('241', 'Action')];
            const expected = ValidationResult.Failure(
                'For following cargo card types no card type was generated:\nEvent',
            );

            const actual = validator.validate(cardTypes, cargoCardTypes);

            expect(actual).toEqual(expected);
        });

        it('with a card type for each cargo card type should return Success', () => {
            const cargoCardTypes: CargoCardType[] = [
                cargoCardType('241', 'Action'),
                cargoCardType('320', 'Event'),
            ];
            const cardTypes: CardType[] = [cardType('241', 'Action'), cardType('320', 'Event')];

            const actual = validator.validate(cardTypes, cargoCardTypes);

            expect(actual).toEqual(ValidationResult.Success);
        });
    });
});
