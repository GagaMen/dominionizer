import { CardTypePage } from './../wiki-client/api-models';
import { CardPage } from '../wiki-client/api-models';
import { CardDtoBuilder } from './card-dto-builder';
import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { CardType } from '../../../../../src/app/models/card-type';

describe('CardDtoBuilder', () => {
    let cardDtoBuilder: CardDtoBuilder;

    const cardExpansionsMap: Map<string, number[]> = new Map();
    cardExpansionsMap.set('Ghost Town', [4213]);
    cardExpansionsMap.set('Knights', [156]);

    const cardTypes: CardType[] = [
        { id: 216, name: 'Action' },
        { id: 219, name: 'Attack' },
        { id: 577, name: 'Knight' },
        { id: 593, name: 'Duration' },
        { id: 1584, name: 'Event' },
        { id: 4216, name: 'Night' },
    ];

    const nullCardPage: CardPage = {
        pageid: 0,
        title: '',
        fullurl: '',
        revisions: [],
    };
    const nullCardDto: CardDto = {
        id: nullCardPage.pageid,
        name: nullCardPage.title,
        description: '',
        image: '',
        wikiUrl: nullCardPage.fullurl,
        expansions: [],
        types: [],
        isKingdomCard: true,
        cost: 0,
        costModifier: undefined,
        debt: undefined,
    };

    beforeEach(() => {
        cardDtoBuilder = new CardDtoBuilder();
    });

    describe('build', () => {
        it('with basic cardPage should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 5167,
                title: 'Ghost Town',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Ghost_Town',
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\n` +
                            `|name = Ghost Town\n` +
                            `|cost = 3\n` +
                            `|type1 = Night\n` +
                            `|type2 = Duration\n` +
                            `|text = At the start...\n` +
                            `|text2 = This is gained ...\n}}\n\n` +
                            `== Trivia ==\n` +
                            `[[Image:Ghost TownArt.jpg|thumb|right|354px|Official card art.]]\n\n`,
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                id: cardPage.pageid,
                name: 'Ghost Town',
                description: `At the start...{{divline}}This is gained ...`,
                image: 'Ghost_TownArt.jpg',
                wikiUrl: cardPage.fullurl,
                expansions: [4213],
                types: [4216, 593],
                isKingdomCard: true,
                cost: 3,
            };

            const actual = cardDtoBuilder.build(cardPage, cardExpansionsMap, cardTypes);

            expect(actual).toEqual(expected);
        });

        it('with cardPage and redirectingCardPage should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 10190,
                title: 'Farm',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Farm',
                revisions: [
                    {
                        '*': `{{Infobox Card\n |name = Farm\n}}`,
                    },
                ],
            };
            const redirectingCardPage: CardPage = {
                ...nullCardPage,
                pageid: 94,
                title: 'Harem',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Harem',
                revisions: [
                    {
                        '*': `#REDIRECT [[Farm]]`,
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                id: redirectingCardPage.pageid,
                name: 'Harem',
                wikiUrl: redirectingCardPage.fullurl,
            };

            const actual = cardDtoBuilder.build(
                cardPage,
                cardExpansionsMap,
                cardTypes,
                redirectingCardPage,
            );

            expect(actual).toEqual(expected);
        });

        it('with cardPage uses template for name should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                title: 'Sacred Grove',
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\n |name = {{PAGENAME}}\n}}` +
                            `== Trivia ==\n` +
                            `[[Image:{{PAGENAME}}Art.jpg|thumb|right|354px|Official card art.]]\n\n`,
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                name: 'Sacred Grove',
                image: 'Sacred_GroveArt.jpg',
            };

            const actual = cardDtoBuilder.build(cardPage, cardExpansionsMap, cardTypes);

            expect(actual).toEqual(expected);
        });

        it('with cardPage contains <br/> in text1 or text2 should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                title: 'Sacred Grove',
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\n` +
                            `|text = At the<br/>start...\n` +
                            `|text2 = This is<br/>gained ...\n}}`,
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                description: `At the<br>start...{{divline}}This is<br>gained ...`,
            };

            const actual = cardDtoBuilder.build(cardPage, cardExpansionsMap, cardTypes);

            expect(actual).toEqual(expected);
        });

        it('with cardPage uses OfficialArt template should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\n |name = Horn of Plenty\n}}` +
                            `== Trivia ==\n{{OfficialArt|l=1}}\n\n`,
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                name: 'Horn of Plenty',
                image: 'Horn_of_PlentyArt.jpg',
            };

            const actual = cardDtoBuilder.build(cardPage, cardExpansionsMap, cardTypes);

            expect(actual).toEqual(expected);
        });

        it('with cardPage reuses art of another card should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                title: 'Miserable',
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\n | name=Miserable\n}}` +
                            `== Trivia ==\n` +
                            `[[Image:MiseryArt.jpg|thumb|right|500px|Official card art ` +
                            `(the same as Twice Miserable's art).]]\n\n`,
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                name: 'Miserable',
                image: 'MiseryArt.jpg',
            };

            const actual = cardDtoBuilder.build(cardPage, cardExpansionsMap, cardTypes);

            expect(actual).toEqual(expected);
        });

        it('with cardPage has original and alternate art should return correct card', () => {
            // TODO: update test when alternate art is actually used
            const cardPage: CardPage = {
                ...nullCardPage,
                title: 'Farm',
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\n | name=Farm\n}}` +
                            `== Trivia ==\n` +
                            `[[Image:HaremArt.jpg|thumb|right|354px|Official original card's art.]]\n`,
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                name: 'Farm',
                image: 'HaremArt.jpg',
            };

            const actual = cardDtoBuilder.build(cardPage, cardExpansionsMap, cardTypes);

            expect(actual).toEqual(expected);
        });

        it('with cardPage of non-kingdom card should return correct card', () => {
            const cardPageOne: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*': '{{Infobox Card\n |kingdom = No\n}}',
                    },
                ],
            };
            const cardPageTwo: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*': '{{Infobox Card\n |kingdom = no\n}}',
                    },
                ],
            };
            const expected: CardDto[] = [
                {
                    ...nullCardDto,
                    isKingdomCard: false,
                },
                {
                    ...nullCardDto,
                    isKingdomCard: false,
                },
            ];

            const actual = [
                cardDtoBuilder.build(cardPageOne, new Map(), []),
                cardDtoBuilder.build(cardPageTwo, new Map(), []),
            ];

            expect(actual).toEqual(expected);
        });

        it('with cardPage contains cost modifier should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*': '{{Infobox Card\n |cost = 3P\n}}',
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                cost: 3,
                costModifier: 'P',
            };

            const actual = cardDtoBuilder.build(cardPage, cardExpansionsMap, cardTypes);

            expect(actual).toEqual(expected);
        });

        it('with cardPage contains debt should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*': '{{Infobox Card\n |cost2 = 4\n}}',
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                debt: 4,
            };

            const actual = cardDtoBuilder.build(cardPage, cardExpansionsMap, cardTypes);

            expect(actual).toEqual(expected);
        });

        it('with cardPage contains non card infobox should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*': '{{Infobox Event\n |name=Save\n}}',
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                name: 'Save',
                isKingdomCard: false,
            };

            const actual = cardDtoBuilder.build(cardPage, new Map(), []);

            expect(actual).toEqual(expected);
        });

        it('with cardTypePage should return correct card', () => {
            const cardTypePage: CardTypePage = {
                ...nullCardPage,
                pageid: 577,
                title: 'Knight',
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\n` +
                            `|name = Knights\n` +
                            `|cost = 5\n` +
                            `|type1 = Action\n` +
                            `|type2 = Attack\n` +
                            `|type3 = Knight\n` +
                            `|illustrator = Matthias Catrein\n` +
                            `|text = Shuffle the Knights...\n` +
                            `|nocats = Yes\n}}\n\n` +
                            `== Trivia ==\n` +
                            `[[Image:KnightsArt.jpg|thumb|right|354px|Official randomizer card art.]]\n\n`,
                    },
                ],
            };
            const expected: CardDto = {
                ...nullCardDto,
                id: cardTypePage.pageid,
                name: 'Knights',
                description: `Shuffle the Knights...`,
                image: 'KnightsArt.jpg',
                wikiUrl: '',
                expansions: [156],
                types: [216, 219, 577],
                isKingdomCard: true,
                cost: 5,
            };

            const actual = cardDtoBuilder.build(cardTypePage, cardExpansionsMap, cardTypes);

            expect(actual).toEqual(expected);
        });

        it('without infobox in cardTypePage should return null', () => {
            const cardTypePage: CardTypePage = {
                ...nullCardPage,
                pageid: 216,
                title: 'Action',
                revisions: [
                    {
                        '*': '',
                    },
                ],
            };

            const actual = cardDtoBuilder.build(cardTypePage, cardExpansionsMap, cardTypes);

            expect(actual).toBeNull();
        });
    });
});
