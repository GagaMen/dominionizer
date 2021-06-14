import { ExpansionBuilder } from './expansion-builder';
import { ExpansionPage } from '../wiki-client/api-models';
import { Expansion } from '../../../../../src/app/models/expansion';

describe('ExpansionBuilder', () => {
    let expansionBuilder: ExpansionBuilder;

    beforeEach(() => {
        expansionBuilder = new ExpansionBuilder();
    });

    describe('build', () => {
        it('with single release should return correct expansion', () => {
            const expansionPage: ExpansionPage = {
                pageid: 1,
                title: 'Dominion (Base Set)',
                revisions: [{ '*': 'wiki text of expansion' }],
            };
            const expected: Expansion[] = [
                {
                    id: expansionPage.pageid,
                    name: 'Dominion',
                    icon: 'Dominion_icon.png',
                },
            ];

            const actual = expansionBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with multiple releases should return correct expansions for each release', () => {
            const expansionPage: ExpansionPage = {
                pageid: 1,
                title: 'Dominion (Base Set)',
                revisions: [
                    { '*': '{{Infobox Set\\n|release = October 2008 (1st) / Fall 2016 (2nd)\\n}}' },
                ],
            };
            const expected: Expansion[] = [
                {
                    id: expansionPage.pageid,
                    name: 'Dominion (1. Edition)',
                    icon: 'Dominion_old_icon.png',
                },
                {
                    id: expansionPage.pageid + 0.1,
                    name: 'Dominion (2. Edition)',
                    icon: 'Dominion_icon.png',
                },
            ];

            const actual = expansionBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });
    });
});
