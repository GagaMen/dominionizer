import { CardType } from '../../../../../src/app/models/card-type';
import { CardPage } from '../wiki-client/api-models';
import { CardDtoBuilder } from './card-dto-builder';
import { CardDto } from 'src/app/dtos/card-dto';

describe('CardDtoBuilder', () => {
    let cardDtoBuilder: CardDtoBuilder;

    const expansionMap: Map<string, number[]> = new Map();
    expansionMap.set('Moat', [914, 914.1]);

    beforeEach(() => {
        cardDtoBuilder = new CardDtoBuilder(expansionMap);
    });

    describe('build', () => {
        it('should return correct card', () => {
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
    });
});
