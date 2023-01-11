import { ExpansionTranslation } from '../../../../../src/app/models/expansion';
import { ExpansionPage } from '../wiki-client/api-models';
import { ExpansionTranslationBuilder } from './expansion-translation-builder';

describe('ExpansionTranslationBuilder', () => {
    let expansionTranslationBuilder: ExpansionTranslationBuilder;

    beforeEach(() => {
        expansionTranslationBuilder = new ExpansionTranslationBuilder();
    });

    describe('build', () => {
        it('should return correct translations', () => {
            const expansionPage: ExpansionPage = {
                pageid: 914,
                title: 'Dominion (Base Set)',
                revisions: [
                    {
                        '*':
                            `=== In other languages ===\n` +
                            `* Chinese: 皇舆争霸 (pron. ''huáng yú zhēngbà'', lit. ''Struggle for the emperor's throne'')\n` +
                            `* Czech: Dominion\n` +
                            `* Dutch: \n` +
                            `** Dominion: In naam van de Koning! (lit. ''In the name of the King!'') (first edition)\n` +
                            `** Dominion: Wie bouwt het mooiste koninkrijk? (lit. ''Who will build the most beautiful kingdom?'') (first edition)\n` +
                            `** Dominion: Tweede editie (second edition)\n` +
                            `* Finnish: Dominion: Valtakunta (lit. ''The kingdom'')\n` +
                            `* French: Dominion: Votre royaume commence ici! (lit. ''Your kingdom begins here!'')\n` +
                            `* German: Dominion: Was für eine Welt! (lit. ''What a world!'')\n` +
                            `* Greek: Dominion: Ο κυρίαρχος (pron. ''o kyriarchos'', lit. ''The dominant'')\n` +
                            `* Hungarian: Dominion\n` +
                            `* Italian: Dominion: Nasce un Regno (lit. ''Birth of a kingdom'')\n` +
                            `* Japanese: ドミニオン (pron. ''dominion'')\n` +
                            `* Korean: 도미니언 (pron. ''dominieon'')\n` +
                            `* Norwegian: Dominion\n` +
                            `* Polish: \n` +
                            `** Dominion: Rozdarte Królestwo (lit. ''A kingdom torn apart'') ([[Bard Centrum Gier|Bard]] edition)\n` +
                            `** Dominion ([[GFP]] edition)\n` +
                            `* Romanian: Dominion\n` +
                            `* Russian: Доминион (pron. ''dominion'')\n` +
                            `* Spanish: Dominion\n` +
                            `* Swedish: Dominion: Spelet om kungadömet (lit. ''The game of the kingdom'')\n` +
                            `<!--* Mexican: \n` +
                            `* Portuguese: \n` +
                            `-->\n`,
                    },
                ],
            };
            const expected: Map<string, ExpansionTranslation> = new Map([
                ['Chinese', { id: expansionPage.pageid, name: '皇舆争霸' }],
                ['Czech', { id: expansionPage.pageid, name: 'Dominion' }],
                ['Dutch', { id: expansionPage.pageid, name: 'Dominion' }],
                ['Finnish', { id: expansionPage.pageid, name: 'Dominion' }],
                ['French', { id: expansionPage.pageid, name: 'Dominion' }],
                ['German', { id: expansionPage.pageid, name: 'Dominion' }],
                ['Greek', { id: expansionPage.pageid, name: 'Dominion' }],
                ['Hungarian', { id: expansionPage.pageid, name: 'Dominion' }],
                ['Italian', { id: expansionPage.pageid, name: 'Dominion' }],
                ['Japanese', { id: expansionPage.pageid, name: 'ドミニオン' }],
                ['Korean', { id: expansionPage.pageid, name: '도미니언' }],
                ['Norwegian', { id: expansionPage.pageid, name: 'Dominion' }],
                ['Polish', { id: expansionPage.pageid, name: 'Dominion' }],
                ['Romanian', { id: expansionPage.pageid, name: 'Dominion' }],
                ['Russian', { id: expansionPage.pageid, name: 'Доминион' }],
                ['Spanish', { id: expansionPage.pageid, name: 'Dominion' }],
                ['Swedish', { id: expansionPage.pageid, name: 'Dominion' }],
            ]);

            const actual = expansionTranslationBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with release announcement should return correct translations', () => {
            const expansionPage: ExpansionPage = {
                pageid: 914,
                title: 'Dominion (Base Set)',
                revisions: [
                    {
                        '*':
                            `=== In other languages ===\n` +
                            `* Dutch (release March 16, 2022): Bondgenoten\n` +
                            `* German (release March 28, 2022): Verbündete\n` +
                            `* Japanese (release announced for 2022 or later): 同盟\n` +
                            `* Korean (release announced for 2022): 도미니언: 굳건한 동맹`,
                    },
                ],
            };
            const expected: Map<string, ExpansionTranslation> = new Map([
                ['Dutch', { id: expansionPage.pageid, name: 'Bondgenoten' }],
                ['German', { id: expansionPage.pageid, name: 'Verbündete' }],
                ['Japanese', { id: expansionPage.pageid, name: '同盟' }],
                ['Korean', { id: expansionPage.pageid, name: '도미니언' }],
            ]);

            const actual = expansionTranslationBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });

        it('with additional information should return correct translations', () => {
            const expansionPage: ExpansionPage = {
                pageid: 914,
                title: 'Dominion (Base Set)',
                revisions: [
                    {
                        '*':
                            `=== In other languages ===\n` +
                            `* Czech: Alchymie\n` +
                            `* Dutch: De Alchemisten (lit. ''the alchemists'')\n` +
                            `** No longer available. In 2019 999 games combined ...\n` +
                            `* Finnish: Alkemia`,
                    },
                ],
            };
            const expected: Map<string, ExpansionTranslation> = new Map([
                ['Czech', { id: expansionPage.pageid, name: 'Alchymie' }],
                ['Dutch', { id: expansionPage.pageid, name: 'De Alchemisten' }],
                ['Finnish', { id: expansionPage.pageid, name: 'Alkemia' }],
            ]);

            const actual = expansionTranslationBuilder.build(expansionPage);

            expect(actual).toEqual(expected);
        });
    });
});
