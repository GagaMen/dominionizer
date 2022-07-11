import { ExpansionPage } from '../wiki-client/api-models';
import { ExpansionCardsMapBuilder } from './expansion-cards-map-builder';

describe('ExpansionMapBuilder', () => {
    let expansionMapBuilder: ExpansionCardsMapBuilder;

    beforeEach(() => {
        expansionMapBuilder = new ExpansionCardsMapBuilder();
    });

    describe('build', () => {
        it('with single edition should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 175,
                title: 'Seaside',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}}: {{ Card | Embargo }}\n' +
                            '* {{Cost|3}}: {{Card|Ambassador}}, {{Card|Fishing Village}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [175, ['Embargo', 'Ambassador', 'Fishing Village']],
            ]);

            const actual = expansionMapBuilder.build(expansionPage);

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
                            '* {{Cost|2}}: {{Card|Cellar}}\n* {{Cost|3}}: {{Card|Harbinger}}*\n\n' +
                            '=== Removed first-edition Kingdom cards ===\n' +
                            'These cards were included in the first edition, and [[Removed cards|removed]] from the second edition.\n' +
                            '* {{Cost|3}}: {{Card|Chancellor}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [914, ['Cellar', 'Chancellor']],
                [914.1, ['Harbinger', 'Cellar']],
            ]);

            const actual = expansionMapBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with prizes should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 180,
                title: 'Cornucopia',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Prizes ===\n' +
                            'The 5 cards in the [[Prize]] pile are unique.\n' +
                            '* {{Cost|0*}}: {{Card|Bag of Gold}}, {{Card|Diadem}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([[180, ['Bag of Gold', 'Diadem']]]);

            const actual = expansionMapBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with ruins should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 156,
                title: 'Dark Ages',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|1}}: {{Card|Poor House}}\n\n' +
                            '=== Additional materials ===\n' +
                            '==== Ruins ====\n' +
                            '* {{Cost|0}}: {{Card|Abandoned Mine}}, {{Card|Ruined Library}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [156, ['Poor House', 'Abandoned Mine', 'Ruined Library']],
            ]);

            const actual = expansionMapBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with shelters should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 156,
                title: 'Dark Ages',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|1}}: {{Card|Poor House}}\n\n' +
                            '=== Additional materials ===\n' +
                            '==== Shelters ====\n' +
                            '* {{Cost|1}}: {{Card|Hovel}}, {{Card|Necropolis}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [156, ['Poor House', 'Hovel', 'Necropolis']],
            ]);

            const actual = expansionMapBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with non-supply cards should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 156,
                title: 'Dark Ages',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|1}}: {{Card|Poor House}}\n\n' +
                            '=== Additional materials ===\n' +
                            '==== Non-Supply cards ====\n' +
                            '* {{Cost|0*}}: {{Card|Madman}}, {{Card|Mercenary}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [156, ['Poor House', 'Madman', 'Mercenary']],
            ]);

            const actual = expansionMapBuilder.build(expansionPage);

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

            const actual = expansionMapBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with upgrade cards should return correct map', () => {
            const expansionPage: ExpansionPage = {
                pageid: 1579,
                title: 'Adventures',
                revisions: [
                    {
                        '*':
                            '== Contents ==\n' +
                            '=== Kingdom cards ===\n' +
                            '* {{Cost|2}}: {{Card|Coin of the Realm}}\n\n' +
                            '=== Additional materials ===\n' +
                            '==== Upgrade cards ====\n' +
                            '* {{Cost|3*}}: {{Card|Soldier}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [1579, ['Coin of the Realm', 'Soldier']],
            ]);

            const actual = expansionMapBuilder.build(expansionPage);

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

            const actual = expansionMapBuilder.build(expansionPage);

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
                            '=== Additional materials ===\n\n' +
                            '==== [[Boon]]s ====\n' +
                            "{{Boon|The Earth's Gift}}, {{Boon|The Field's Gift}}",
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [4213, ['Druid', "The Earth's Gift", "The Field's Gift"]],
            ]);

            const actual = expansionMapBuilder.build(expansionPage);

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
                            '=== Additional materials ===\n\n' +
                            '====[[Hex]]es ====\n' +
                            '{{Hex|Bad Omens}}, {{Hex|Delusion}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [4213, ['Druid', 'Bad Omens', 'Delusion']],
            ]);

            const actual = expansionMapBuilder.build(expansionPage);

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
                            '=== Additional materials ===\n\n' +
                            '==== [[State]]s ====\n' +
                            '* {{State|Lost in the Woods}} (1 copy)\n' +
                            '* {{State|Deluded}}/{{State|Envious}} (6 copies, double-sided)',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [4213, ['Druid', 'Lost in the Woods', 'Deluded', 'Envious']],
            ]);

            const actual = expansionMapBuilder.build(expansionPage);

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
                            '=== Additional materials ===\n' +
                            '====[[Artifact]]s====\n' +
                            '1 each of: {{Artifact|Flag}}, {{Artifact|Horn}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [6098, ['Border Guard', 'Flag', 'Horn']],
            ]);

            const actual = expansionMapBuilder.build(expansionPage);

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
                            '=== Additional materials ===\n' +
                            '====[[Project]]s====\n' +
                            '* {{Cost|3}} {{Project|Cathedral}}, {{Project|City Gate}}',
                    },
                ],
            };
            const expected: Map<number, string[]> = new Map([
                [6098, ['Border Guard', 'Cathedral', 'City Gate']],
            ]);

            const actual = expansionMapBuilder.build(expansionPage);

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

            const actual = expansionMapBuilder.build(expansionPage);

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

            const actual = expansionMapBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with cards in entry text of kingdom cards section should return correct map', () => {
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

            const actual = expansionMapBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });
    });
});
