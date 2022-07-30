import { CardType } from './../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { CardTypeBuilder } from './card-type-builder';

describe('CardTypeBuilder', () => {
    let cardTypeBuilder: CardTypeBuilder;

    beforeEach(() => {
        cardTypeBuilder = new CardTypeBuilder();
    });

    describe('build', () => {
        it('should return correct card type', () => {
            const cardTypePage: CardTypePage = {
                pageid: 1,
                title: 'Card Type Name',
                fullurl: 'http://wiki.dominionstrategy.com/index.php/Knight',
                revisions: [{ '*': 'wiki text of card type' }],
            };
            const expected: CardType = {
                id: cardTypePage.pageid,
                name: cardTypePage.title,
            };

            const actual = cardTypeBuilder.build(cardTypePage);

            expect(actual).toEqual(expected);
        });
    });
});
