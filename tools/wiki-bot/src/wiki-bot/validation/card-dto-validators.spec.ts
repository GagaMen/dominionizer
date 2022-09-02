import { CardType } from './../../../../../src/app/models/card-type';
import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { CardPage } from '../wiki-client/api-models';
import { CardDtoValidator, CardDtosValidator } from './card-dto-validators';
import { ValidationResult } from './validation-result';

describe('card dto validators', () => {
    describe('CardDtoValidator', () => {
        const validator = new CardDtoValidator();

        describe('validate', () => {
            const cardPage: CardPage = {
                pageid: 1,
                title: 'Cellar',
            } as CardPage;

            it('with basic card dto should return Success', () => {
                const card: CardDto = {
                    id: 1,
                    name: 'Cellar',
                    description: `'''+1 Action'''<br>Discard any...`,
                    image: 'CellarArt.jpg',
                    wikiUrl: 'http://wiki.dominionstrategy.com/index.php/Cellar',
                    expansions: [914, 914.1],
                    types: [216],
                    isKingdomCard: true,
                    cost: 2,
                };

                const actual = validator?.validate(card, cardPage);

                expect(actual).toEqual(ValidationResult.Success);
            });

            it('with card has debt cost should return Success', () => {
                const card: CardDto = {
                    id: 3337,
                    name: 'Engineer',
                    description: 'Gain a card costing up to {{Cost|4}}.',
                    image: 'EngineerArt.jpg',
                    wikiUrl: 'http://wiki.dominionstrategy.com/index.php/Engineer',
                    expansions: [2739],
                    types: [216],
                    isKingdomCard: true,
                    cost: 0,
                    debt: 4,
                };

                const actual = validator?.validate(card, cardPage);

                expect(actual).toEqual(ValidationResult.Success);
            });

            const costModifiers: string[] = ['P', '+', '*'];
            costModifiers.forEach((costModifier: string) => {
                it(`with card has "${costModifier}" as cost modifier should return Success`, () => {
                    const card: CardDto = {
                        id: 128,
                        name: 'University',
                        description: "'''+2 Actions'''<br>You may...",
                        image: 'UniversityArt.jpg',
                        wikiUrl: 'http://wiki.dominionstrategy.com/index.php/University',
                        expansions: [176],
                        types: [216],
                        isKingdomCard: true,
                        cost: 2,
                        costModifier,
                    };

                    const actual = validator?.validate(card, cardPage);

                    expect(actual).toEqual(ValidationResult.Success);
                });
            });

            it('with card dto has empty values or wrong types should return Failure', () => {
                const card: CardDto = {
                    id: 1,
                    name: '',
                    description: '',
                    image: '',
                    wikiUrl: '',
                    expansions: [],
                    types: [],
                    isKingdomCard: true,
                    cost: 1.1,
                    costModifier: '',
                    debt: 1.1,
                };
                const expected = ValidationResult.Failure(
                    'Card Dto (ID: 1, Name: "Cellar"):\n' +
                        '"name" is not allowed to be empty\n' +
                        '"description" is not allowed to be empty\n' +
                        '"image" is not allowed to be empty\n' +
                        '"wikiUrl" is not allowed to be empty\n' +
                        '"expansions" must contain at least 1 items\n' +
                        '"types" must contain at least 1 items\n' +
                        '"cost" must be an integer\n' +
                        '"costModifier" must be one of [P, *, +]\n' +
                        '"costModifier" is not allowed to be empty\n' +
                        '"debt" must be an integer',
                );

                const actual = validator?.validate(card, cardPage);

                expect(actual).toEqual(expected);
            });

            it('with card dto wrong values should return Failure', () => {
                const card: CardDto = {
                    id: 1,
                    name: 'Cellar',
                    description: `'''+1 Action'''<br>Discard any...`,
                    image: 'CellarArt.jpg',
                    wikiUrl: 'ftp://wiki.dominionstrategy.com/index.php/Cellar',
                    expansions: [914, 914.1],
                    types: [216],
                    isKingdomCard: true,
                    cost: -2,
                    costModifier: 'A',
                    debt: -2,
                };
                const expected = ValidationResult.Failure(
                    'Card Dto (ID: 1, Name: "Cellar"):\n' +
                        '"wikiUrl" must be a valid uri with a scheme matching the http|https pattern\n' +
                        '"cost" must be greater than or equal to 0\n' +
                        '"costModifier" must be one of [P, *, +]\n' +
                        '"debt" must be greater than or equal to 0',
                );

                const actual = validator?.validate(card, cardPage);

                expect(actual).toEqual(expected);
            });
        });
    });

    describe('CardDtosValidator', () => {
        const validator = new CardDtosValidator();

        describe('validate', () => {
            it('with valid card amount should return Success', () => {
                const cards: CardDto[] = [
                    { id: 1 } as CardDto,
                    { id: 2 } as CardDto,
                    { id: 3 } as CardDto,
                ];
                const cardTypes: CardType[] = [{ id: 3 } as CardType];
                const cardPages: CardPage[] = [
                    { pageid: 1 } as CardPage,
                    { pageid: 2 } as CardPage,
                ];
                const expected = ValidationResult.Success;

                const actual = validator?.validate(cards, cardTypes, cardPages);

                expect(actual).toEqual(expected);
            });

            it('with no card for card page should return Failure', () => {
                const cards: CardDto[] = [{ id: 1 } as CardDto, { id: 2 } as CardDto];
                const cardTypes: CardType[] = [{ id: 2 } as CardType];
                const cardPages: CardPage[] = [
                    { pageid: 1 } as CardPage,
                    { pageid: 3, title: 'Card 1' } as CardPage,
                    { pageid: 4, title: 'Card 2' } as CardPage,
                ];
                const expected = ValidationResult.Failure(
                    'For following card pages no card was generated:\nCard 1\nCard 2',
                );

                const actual = validator?.validate(cards, cardTypes, cardPages);

                expect(actual).toEqual(expected);
            });
        });
    });
});
