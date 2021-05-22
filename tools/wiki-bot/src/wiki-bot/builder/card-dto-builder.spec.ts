import { CardType } from '../../../../../src/app/models/card-type';
import { CardPage } from '../wiki-client/api-models';
import { CardDtoBuilder } from './card-dto-builder';
import { CardDto } from 'src/app/dtos/card-dto';

describe('CardDtoBuilder', () => {
    let cardDtoBuilder: CardDtoBuilder;

    const cardExpansionsMap: Map<string, number[]> = new Map();
    cardExpansionsMap.set('Moat', [914, 914.1]);
    cardExpansionsMap.set('Engineer', [2739]);
    cardExpansionsMap.set('Alchemist', [176]);

    const undefinedCardDto: Partial<CardDto> = {
        potion: undefined,
        debt: undefined,
    };

    beforeEach(() => {
        cardDtoBuilder = new CardDtoBuilder(cardExpansionsMap);
    });

    describe('build', () => {
        it('with basic cardPage should return correct card', () => {
            const cardPage: CardPage = {
                pageid: 18,
                title: 'Moat',
                fullurl: 'http://wiki.dominionstrategy.com/index.php/Moat',
                revisions: [
                    {
                        '*':
                            '{{Infobox Card\\n|name = Moat\\n|cost = 2\\n|type1 = Action\\n|type2 = Reaction\\n}}',
                    },
                ],
            };
            const expected: CardDto = {
                ...undefinedCardDto,
                id: cardPage.pageid,
                name: cardPage.title,
                expansions: [914, 914.1],
                types: [CardType.Action, CardType.Reaction],
                isKingdomCard: true,
                cost: 2,
            };

            const actual = cardDtoBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with cardPage contains debt should return correct card', () => {
            const cardPage: CardPage = {
                pageid: 3337,
                title: 'Engineer',
                fullurl: 'http://wiki.dominionstrategy.com/index.php/Engineer',
                revisions: [
                    {
                        '*':
                            '{{Infobox Card\\n |name = Engineer\\n |cost2 = 4\\n |type1 = Action\\n}}',
                    },
                ],
            };
            const expected: CardDto = {
                ...undefinedCardDto,
                id: cardPage.pageid,
                name: cardPage.title,
                expansions: [2739],
                types: [CardType.Action],
                isKingdomCard: true,
                cost: 0,
                debt: 4,
            };

            const actual = cardDtoBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with cardPage contains potion should return correct card', () => {
            const cardPage: CardPage = {
                pageid: 129,
                title: 'Alchemist',
                fullurl: 'http://wiki.dominionstrategy.com/index.php/Alchemist',
                revisions: [
                    {
                        '*':
                            '{{Infobox Card\\n |name = Alchemist\\n |cost = 3P\\n |type1 = Action\\n}}',
                    },
                ],
            };
            const expected: CardDto = {
                ...undefinedCardDto,
                id: cardPage.pageid,
                name: cardPage.title,
                expansions: [176],
                types: [CardType.Action],
                isKingdomCard: true,
                cost: 3,
                potion: true,
            };

            const actual = cardDtoBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });
    });
});
