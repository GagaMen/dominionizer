import { DataFixture } from '../../../../../src/testing/data-fixture';
import { CardType } from '../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { CardTypesValidator, CardTypeValidator } from './card-type-validators';
import { ValidationResult } from './validation-result';

describe('card type validators', () => {
    let dataFixture: DataFixture;

    beforeEach(() => {
        dataFixture = new DataFixture();
    });

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

    describe('CardTypesValidator', () => {
        const validator = new CardTypesValidator();

        describe('validate', () => {
            it('with valid card type amount should return Success', () => {
                const cardTypes: CardType[] = [
                    dataFixture.createCardType({ id: 1 }),
                    dataFixture.createCardType({ id: 2 }),
                ];
                const cardTypePages: CardTypePage[] = [
                    { pageid: 1 } as CardTypePage,
                    { pageid: 2 } as CardTypePage,
                ];
                const expected = ValidationResult.Success;

                const actual = validator?.validate(cardTypes, cardTypePages);

                expect(actual).toEqual(expected);
            });

            it('with no card type for card type page should return Failure', () => {
                const cardTypes: CardType[] = [dataFixture.createCardType({ id: 1 })];
                const cardTypePages: CardTypePage[] = [
                    { pageid: 1 } as CardTypePage,
                    { pageid: 2, title: 'Card Type 2' } as CardTypePage,
                    { pageid: 3, title: 'Card Type 3' } as CardTypePage,
                ];
                const expected = ValidationResult.Failure(
                    'For following card type pages no card type was generated:\nCard Type 2\nCard Type 3',
                );

                const actual = validator?.validate(cardTypes, cardTypePages);

                expect(actual).toEqual(expected);
            });
        });
    });
});
