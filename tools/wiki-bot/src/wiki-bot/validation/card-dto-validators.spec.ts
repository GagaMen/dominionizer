import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { CargoCard } from '../wiki-client/api-models';
import { CardDtoValidator, CardDtosValidator } from './card-dto-validators';
import { ValidationResult } from './validation-result';

describe('CardDtoValidator', () => {
    const targetPath = '../../src';
    const validator = new CardDtoValidator(targetPath);

    describe('validate', () => {
        it('with basic card dto should return Success', () => {
            const card: CardDto = {
                id: '5293',
                name: 'Cellar',
                description: `'''+1 Action'''<br>Discard any...`,
                image: 'CellarArt.jpg',
                illustrator: 'Mark Poole',
                wikiUrl: 'https://wiki.dominionstrategy.com/index.php/Cellar',
                editions: ['301', '302'],
                types: ['241'],
                isKingdomCard: true,
                cost: 2,
            };

            const actual = validator.validate(card);

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with card has debt cost should return Success', () => {
            const card: CardDto = {
                id: '6029',
                name: 'Engineer',
                description: 'Gain a card costing up to {{Cost|4}}.',
                image: 'EngineerArt.jpg',
                illustrator: 'Mark Poole',
                wikiUrl: 'https://wiki.dominionstrategy.com/index.php/Engineer',
                editions: ['279'],
                types: ['241'],
                isKingdomCard: true,
                cost: 0,
                debt: 4,
            };

            const actual = validator.validate(card);

            expect(actual).toEqual(ValidationResult.Success);
        });

        const costModifiers: string[] = ['P', '+', '*'];
        costModifiers.forEach((costModifier: string) => {
            it(`with card has "${costModifier}" as cost modifier should return Success`, () => {
                const card: CardDto = {
                    id: '5275',
                    name: 'University',
                    description: "'''+2 Actions'''<br>You may...",
                    image: 'UniversityArt.jpg',
                    illustrator: 'Mark Poole',
                    wikiUrl: 'https://wiki.dominionstrategy.com/index.php/University',
                    editions: ['304'],
                    types: ['241'],
                    isKingdomCard: true,
                    cost: 2,
                    costModifier,
                };

                const actual = validator.validate(card);

                expect(actual).toEqual(ValidationResult.Success);
            });
        });

        it('with card dto has empty values or wrong types should return Failure', () => {
            const card: CardDto = {
                id: '215',
                name: '',
                description: '',
                image: '',
                illustrator: '',
                wikiUrl: '',
                editions: [],
                types: [],
                isKingdomCard: true,
                cost: 1.1,
                costModifier: '',
                debt: 1.1,
            };
            const expected = ValidationResult.Failure(
                'Card Dto (ID: 215, Name: ""):\n' +
                    '"name" is not allowed to be empty\n' +
                    '"description" is not allowed to be empty\n' +
                    '"image" is not allowed to be empty\n' +
                    '"illustrator" is not allowed to be empty\n' +
                    '"wikiUrl" is not allowed to be empty\n' +
                    '"editions" must contain at least 1 items\n' +
                    '"types" must contain at least 1 items\n' +
                    '"cost" must be an integer\n' +
                    '"costModifier" must be one of [P, *, +]\n' +
                    '"costModifier" is not allowed to be empty\n' +
                    '"debt" must be an integer',
            );

            const actual = validator.validate(card);

            expect(actual).toEqual(expected);
        });

        it('with card dto has wrong values should return Failure', () => {
            const card: CardDto = {
                id: '5293',
                name: 'Cellar',
                description: `'''+1 Action'''<br>Discard any...`,
                image: 'NonExistentArt.jpg',
                illustrator: 'Mark Poole',
                wikiUrl: 'ftp://wiki.dominionstrategy.com/index.php/Cellar',
                editions: ['301', '302'],
                types: ['241'],
                isKingdomCard: true,
                cost: -2,
                costModifier: 'A',
                debt: -2,
            };
            const expected = ValidationResult.Failure(
                'Card Dto (ID: 5293, Name: "Cellar"):\n' +
                    '"NonExistentArt.jpg" must exist. Is category "Card art" assigned to the corresponding image page?\n' +
                    '"wikiUrl" must be a valid uri with a scheme matching the http|https pattern\n' +
                    '"cost" must be greater than or equal to 0\n' +
                    '"costModifier" must be one of [P, *, +]\n' +
                    '"debt" must be greater than or equal to 0',
            );

            const actual = validator.validate(card);

            expect(actual).toEqual(expected);
        });
    });
});

describe('CardDtosValidator', () => {
    const validator = new CardDtosValidator();

    const cargoCard = (PageId: string, Name: string): CargoCard =>
        ({ PageId, Name }) as unknown as CargoCard;
    const cardDto = (id: string, name: string): CardDto => ({ id, name }) as unknown as CardDto;

    describe('validate', () => {
        it('with cargo card that was not generated should return Failure', () => {
            const cargoCards: CargoCard[] = [
                cargoCard('5293', 'Cellar'),
                cargoCard('6153', 'Sauna'),
            ];
            const cards: CardDto[] = [cardDto('5293', 'Cellar')];
            const expected = ValidationResult.Failure(
                'For following cargo cards no card was generated:\nSauna',
            );

            const actual = validator.validate(cards, cargoCards);

            expect(actual).toEqual(expected);
        });

        it('with a card for each cargo card should return Success', () => {
            const cargoCards: CargoCard[] = [
                cargoCard('5293', 'Cellar'),
                cargoCard('6153', 'Sauna'),
            ];
            const cards: CardDto[] = [cardDto('5293', 'Cellar'), cardDto('6153', 'Sauna')];

            const actual = validator.validate(cards, cargoCards);

            expect(actual).toEqual(ValidationResult.Success);
        });
    });
});
