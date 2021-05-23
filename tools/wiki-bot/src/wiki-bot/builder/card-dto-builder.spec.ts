import { CardType } from '../../../../../src/app/models/card-type';
import { CardPage } from '../wiki-client/api-models';
import { CardDtoBuilder } from './card-dto-builder';
import { CardDto } from 'src/app/dtos/card-dto';

describe('CardDtoBuilder', () => {
    let cardDtoBuilder: CardDtoBuilder;

    const cardExpansionsMap: Map<string, number[]> = new Map();
    cardExpansionsMap.set('Moat', [914, 914.1]);

    const nullCardPage: CardPage = {
        pageid: 0,
        title: '',
        fullurl: '',
        revisions: [],
    };
    const nullCardDto: CardDto = {
        id: nullCardPage.pageid,
        name: nullCardPage.title,
        description: [''],
        image: '',
        wikiUrl: nullCardPage.fullurl,
        expansions: [],
        types: [],
        isKingdomCard: true,
        cost: 0,
        potion: undefined,
        debt: undefined,
    };

    beforeEach(() => {
        cardDtoBuilder = new CardDtoBuilder(cardExpansionsMap);
    });

    describe('build', () => {
        it('with basic cardPage should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 18,
                title: 'Moat',
                fullurl: 'http://wiki.dominionstrategy.com/index.php/Moat',
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\\n` +
                            `|name = Moat\\n` +
                            `|cost = 2\\n` +
                            `|type1 = Action\\n` +
                            `|type2 = Reaction\\n` +
                            `|text = '''+2 Cards'''\\n` +
                            `|text2 = When another player...\\n}}\\n\\n` +
                            `== Trivia ==\\n` +
                            `[[Image:MoatArt.jpg|thumb|right|354px|Official card art.]]\\n\\n`,
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                id: cardPage.pageid,
                name: cardPage.title,
                description: [`'''+2 Cards'''`, `When another player...`],
                image: 'MoatArt.jpg',
                wikiUrl: cardPage.fullurl,
                expansions: [914, 914.1],
                types: [CardType.Action, CardType.Reaction],
                isKingdomCard: true,
                cost: 2,
            };

            const actual = cardDtoBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with cardPage of non-kingdom card should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*': '{{Infobox Card\\n |kingdom = No\\n}}\\n\\n',
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                isKingdomCard: false,
            };

            const actual = cardDtoBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with cardPage contains debt should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*': '{{Infobox Card\\n |cost2 = 4\\n}}\\n\\n',
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                debt: 4,
            };

            const actual = cardDtoBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with cardPage contains potion should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*': '{{Infobox Card\\n |cost = 3P\\n}}\\n\\n',
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                cost: 3,
                potion: true,
            };

            const actual = cardDtoBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });
    });
});
