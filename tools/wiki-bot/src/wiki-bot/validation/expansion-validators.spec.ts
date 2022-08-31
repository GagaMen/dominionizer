import { Expansion } from '../../../../../src/app/models/expansion';
import { ExpansionPage } from '../wiki-client/api-models';
import { ExpansionsValidator, ExpansionValidator } from './expansion-validators';
import { ValidationResult } from './validation-result';

describe('expansion validators', () => {
    describe('ExpansionValidator', () => {
        const validator = new ExpansionValidator();
        const expansionPage: ExpansionPage = { pageid: 1, title: 'Dominion' } as ExpansionPage;

        describe('validate', () => {
            it('with valid expansion should return Success', () => {
                const expansion: Expansion = {
                    id: 1,
                    name: 'Dominion (1. Edition)',
                    icon: 'Dominion_old_icon.png',
                };

                const actual = validator?.validate(expansion, expansionPage);

                expect(actual).toEqual(ValidationResult.Success);
            });

            it('with invalid expansion should return Failure', () => {
                const expansion: Expansion = { id: 1, name: '' } as Expansion;
                const expected = ValidationResult.Failure(
                    'Expansion (ID: 1, Name: "Dominion"):\n' +
                        '"name" is not allowed to be empty\n' +
                        '"icon" is required',
                );

                const actual = validator?.validate(expansion, expansionPage);

                expect(actual).toEqual(expected);
            });
        });
    });

    describe('ExpansionsValidator', () => {
        const validator = new ExpansionsValidator();

        describe('validate', () => {
            it('with valid expansion amount should return Success', () => {
                const expansions: Expansion[] = [
                    { id: 1 } as Expansion,
                    { id: 1.1 } as Expansion,
                    { id: 2 } as Expansion,
                ];
                const expansionPages: ExpansionPage[] = [
                    { pageid: 1 } as ExpansionPage,
                    { pageid: 2 } as ExpansionPage,
                ];
                const expected = ValidationResult.Success;

                const actual = validator?.validate(expansions, expansionPages);

                expect(actual).toEqual(expected);
            });

            it('with no expansion for expansion page should return Failure', () => {
                const expansions: Expansion[] = [{ id: 1 } as Expansion, { id: 1.1 } as Expansion];
                const expansionPages: ExpansionPage[] = [
                    { pageid: 1 } as ExpansionPage,
                    { pageid: 2, title: 'Exp 2' } as ExpansionPage,
                    { pageid: 3, title: 'Exp 3' } as ExpansionPage,
                ];
                const expected = ValidationResult.Failure(
                    'For following expansion pages no expansion was generated:\nExp 2\nExp 3',
                );

                const actual = validator?.validate(expansions, expansionPages);

                expect(actual).toEqual(expected);
            });
        });
    });
});
