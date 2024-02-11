import { DataFixture } from '../../../../../src/testing/data-fixture';
import { CardType, CardTypeId } from '../../../../../src/app/models/card-type';
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
                pageid: CardTypeId.Action,
                title: 'Action',
            } as CardTypePage;

            it('with valid card type should return Success', () => {
                const cardType: CardType = {
                    id: CardTypeId.Action,
                    name: 'Action',
                };

                const actual = validator?.validate(cardType, cardTypePage);

                expect(actual).toEqual(ValidationResult.Success);
            });

            it('with invalid card type should return Failure', () => {
                const cardType: CardType = { id: CardTypeId.Action, name: '' };
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
                    dataFixture.createCardType({ id: CardTypeId.Action }),
                    dataFixture.createCardType({ id: CardTypeId.Boon }),
                ];
                const cardTypePages: CardTypePage[] = [
                    { pageid: CardTypeId.Action } as CardTypePage,
                    { pageid: CardTypeId.Boon } as CardTypePage,
                ];
                const expected = ValidationResult.Success;

                const actual = validator?.validate(cardTypes, cardTypePages);

                expect(actual).toEqual(expected);
            });

            it('with no card type for card type page should return Failure', () => {
                const cardTypes: CardType[] = [
                    dataFixture.createCardType({ id: CardTypeId.Action }),
                ];
                const cardTypePages: CardTypePage[] = [
                    { pageid: CardTypeId.Action } as CardTypePage,
                    { pageid: CardTypeId.Boon, title: 'Boon' } as CardTypePage,
                    { pageid: CardTypeId.Command, title: 'Command' } as CardTypePage,
                ];
                const expected = ValidationResult.Failure(
                    'For following card type pages no card type was generated:\nBoon\nCommand',
                );

                const actual = validator?.validate(cardTypes, cardTypePages);

                expect(actual).toEqual(expected);
            });
        });
    });
});
