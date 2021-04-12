import { Expansion } from './../../../../../src/app/models/expansion';
import { CardType } from '../../../../../src/app/models/card-type';
import { Card } from '../../../../../src/app/models/card';
import { CardPage } from './../wiki-client/api-models';
import { CardBuilder } from './card-builder';

describe('CardBuilder', () => {
    let cardBuilder: CardBuilder;
    const menagerie: Expansion = {
        id: 6737,
        name: 'Menagerie',
        icon: '/assets/icons/expansion_menagerie.png',
    };
    const dominion: Expansion = {
        id: 914,
        name: 'Dominion',
        icon: '/assets/icons/expansion_dominion.png',
    };
    const dominionSecondEdition: Expansion = {
        id: 914.1,
        name: 'Dominion Second Edition',
        icon: '/assets/icons/expansion_dominion.png',
    };

    const expansionMap: Map<string, Expansion[]> = new Map();
    expansionMap.set('Black Cat', [menagerie]);
    expansionMap.set('Moat', [dominion, dominionSecondEdition]);

    beforeEach(() => {
        cardBuilder = new CardBuilder(expansionMap);
    });

    describe('build', () => {
        it('with single expansion should return correct card', () => {
            const cardPage: CardPage = {
                pageid: 1,
                title: 'Black Cat',
                fullurl: 'http://wiki.dominionstrategy.com/index.php/Black_Cat',
                revisions: [
                    {
                        '*':
                            '{{Infobox Card\\n |name = Black Cat\\n |cost = 2\\n |type1 = Action\\n |type2 = Attack\\n |type3 = Reaction\\n}}',
                    },
                ],
            };
            const expected: Card = {
                id: cardPage.pageid,
                name: cardPage.title,
                expansions: [
                    {
                        id: 6737,
                        name: 'Menagerie',
                        icon: '/assets/icons/expansion_menagerie.png',
                    },
                ],
                types: [CardType.Action, CardType.Attack, CardType.Reaction],
                isKingdomCard: true,
                cost: 2,
            };

            const actual = cardBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with multiple expansions should return correct card', () => {
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
            const expected: Card = {
                id: cardPage.pageid,
                name: cardPage.title,
                expansions: [
                    {
                        id: 914,
                        name: 'Dominion',
                        icon: '/assets/icons/expansion_dominion.png',
                    },
                    {
                        id: 914.1,
                        name: 'Dominion Second Edition',
                        icon: '/assets/icons/expansion_dominion.png',
                    },
                ],
                types: [CardType.Action, CardType.Reaction],
                isKingdomCard: true,
                cost: 2,
            };

            const actual = cardBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });
    });
});
