import { CardTypePage } from './../wiki-client/api-models';
import { ExpansionPage } from '../wiki-client/api-models';
import { ExpansionCardsMapBuilder } from './expansion-cards-map-builder';

describe('ExpansionMapBuilder', () => {
    let expansionMapBuilder: ExpansionCardsMapBuilder;

    beforeEach(() => {
        expansionMapBuilder = new ExpansionCardsMapBuilder();
    });

    describe('buildWithExpansionPage', () => {
        it('with single edition should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 175,
                title: 'Seaside',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}}: {{ card | Embargo }}\n' +
                            '* {{Cost|3}}: {{Card|Ambassador}}, {{Card|Fishing Village}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [175, ['Embargo', 'Ambassador', 'Fishing Village']],
            ]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with multiple editions should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 914,
                title: 'Dominion (Base Set)',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards, second edition ===\n' +
                            'Cards with an asterisk (*) were added in the second edition.\n' +
                            '* {{Cost|2}}: {{Card|Cellar}}\n' +
                            '* {{Cost|3}}: {{Card|Harbinger}}*\n' +
                            '* {{Cost|4}}: {{Card|Bureaucrat}}\n\n' +
                            '=== Removed first-edition Kingdom cards ===\n' +
                            'These cards were included in the first edition, and [[Removed cards|removed]] from the second edition.\n' +
                            '* {{Cost|3}}: {{Card|Chancellor}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [914, ['Cellar', 'Bureaucrat', 'Chancellor']],
                [914.1, ['Harbinger', 'Cellar', 'Bureaucrat']],
            ]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with additional parameters in card template should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 171,
                title: 'Intrigue',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Removed first-edition Kingdom cards ===\n' +
                            '* {{Cost|5}}: {{Card|Saboteur|oi=1}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([[171, ['Saboteur']]]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with events should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 1579,
                title: 'Adventures',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}}: {{Card|Coin of the Realm}}\n\n' +
                            '=== Events ===\n' +
                            '* {{Cost|0}}: {{Event|Alms}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [1579, ['Coin of the Realm', 'Alms']],
            ]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with landsmarks should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 2739,
                title: 'Empires',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Debt|4}}: {{Card|Engineer}}\n\n' +
                            '=== Landmarks ===\n' +
                            '* {{Landmark|Aqueduct}}\n' +
                            '* {{Landmark|Arena}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [2739, ['Engineer', 'Aqueduct', 'Arena']],
            ]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with boons should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 4213,
                title: 'Nocturne',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}} {{Card|Druid}}\n\n' +
                            '=== [[Boon]]s ===\n' +
                            "{{Boon|The Earth's Gift}}, {{Boon|The Field's Gift}}",
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [4213, ['Druid', "The Earth's Gift", "The Field's Gift"]],
            ]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with hexes should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 4213,
                title: 'Nocturne',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}} {{Card|Druid}}\n\n' +
                            '===[[Hex]]es ===\n' +
                            '{{Hex|Bad Omens}}, {{Hex|Delusion}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [4213, ['Druid', 'Bad Omens', 'Delusion']],
            ]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with states should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 4213,
                title: 'Nocturne',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}} {{Card|Druid}}\n\n' +
                            '=== [[State]]s ===\n' +
                            '* {{State|Lost in the Woods}} (1 copy)\n' +
                            '* {{State|Deluded}}/{{State|Envious}} (6 copies, double-sided)',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [4213, ['Druid', 'Lost in the Woods', 'Deluded', 'Envious']],
            ]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with artifacts should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 6098,
                title: 'Renaissance',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}} {{Card|Border Guard}}\n\n' +
                            '===[[Artifact]]s===\n' +
                            '1 each of: {{Artifact|Flag}}, {{Artifact|Horn}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [6098, ['Border Guard', 'Flag', 'Horn']],
            ]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with projects should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 6098,
                title: 'Renaissance',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}} {{Card|Border Guard}}\n\n' +
                            '===[[Project]]s===\n' +
                            '* {{Cost|3}} {{Project|Cathedral}}, {{Project|City Gate}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [6098, ['Border Guard', 'Cathedral', 'City Gate']],
            ]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with ways should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 6737,
                title: 'Menagerie',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}}: {{Card|Black Cat}}\n\n' +
                            '=== Ways ===\n' +
                            '* {{Way|Way of the Butterfly}}\n* {{Way|Way of the Camel}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [6737, ['Black Cat', 'Way of the Butterfly', 'Way of the Camel']],
            ]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with allies should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 7293,
                title: 'Allies',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}} {{Card|Bauble}}\n\n' +
                            '=== [[Ally|Allies]] ===\n' +
                            `* {{Ally|Architects' Guild}}\n* {{Ally|Band of Nomads}}`,
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [7293, ['Bauble', `Architects' Guild`, 'Band of Nomads']],
            ]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with traits should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 9040,
                title: 'Plunder',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}} {{Card|Cage}}\n\n' +
                            '=== [[Trait]]s ===\n' +
                            `<p>''15, 1 of each:''` +
                            `<br>{{Trait|Cheap}}, {{Trait|Cursed}}`,
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([[9040, ['Cage', `Cheap`, 'Cursed']]]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with promo cards should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 206,
                title: 'Promo',
                revisions: [
                    {
                        '*':
                            '== Card List ==\n' +
                            '* {{Card|Envoy}} (November 2008)\n* {{Card|Black Market}} (March 2009)',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([[206, ['Envoy', 'Black Market']]]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with double entry should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 156,
                title: 'Dark Ages',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            'There are 20 copies of {{Card|Rats}}. The 10 cards in the {{Card|Knights}} pile are unique.\n' +
                            '* {{Cost|4}}: {{Card|Rats}}\n' +
                            '* {{Cost|5}}: {{Card|Knights}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([[156, ['Rats', 'Knights']]]);

            const actual = expansionMapBuilder.buildWithExpansionPage(expansionPage);

            expect(actual).toEqual(expected);
        });
    });

    describe('buildWithCardTypePage', () => {
        it('with Infobox Card for card of any expansion should return correct map', () => {
            const expansionCardsMap: Map<number, string[]> = new Map([[156, ['Knights']]]);
            const cardTypePage: CardTypePage = {
                pageid: 577,
                title: 'Knight',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Knight',
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\n` +
                            `|name = Knights\n}}\n\n` +
                            `== List of Knights (and their secondary abilities) ==\n` +
                            `* {{Card|Dame Anna}} - ''You may trash up to 2 cards from your hand.''\n` +
                            `* {{Card|Dame Josephine}} - ''2 {{VP}}''\n`,
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [156, ['Knights', 'Dame Anna', 'Dame Josephine']],
            ]);

            const actual = expansionMapBuilder.buildWithCardTypePage(
                cardTypePage,
                expansionCardsMap,
            );

            expect(actual).toEqual(expected);
        });
    });
});
