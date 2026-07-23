import { EditionTranslation } from '../../../../../src/app/models/edition';
import { CargoEdition, ExpansionPage } from '../wiki-client/api-models';
import { EditionTranslationBuilder } from './edition-translation-builder';

describe('EditionTranslationBuilder', () => {
    let editionTranslationBuilder: EditionTranslationBuilder;

    beforeEach(() => {
        editionTranslationBuilder = new EditionTranslationBuilder();
    });

    describe('build', () => {
        it('with multiple editions should return correct translations', () => {
            const expansionPage: ExpansionPage = {
                pageid: 914,
                title: 'Dominion (Base Set)',
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `=== Official releases in other languages ===\n` +
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
                        },
                    },
                ],
            };
            const editions: CargoEdition[] = [
                {
                    Id: '268',
                    PageId: '914',
                    Expansion: 'Dominion',
                    Edition: '2',
                    Icon: 'Dominion_icon.png',
                },
                {
                    Id: '269',
                    PageId: '914',
                    Expansion: 'Dominion',
                    Edition: '1',
                    Icon: 'Dominion old_icon.png',
                },
            ];
            const expected = new Map<string, EditionTranslation[]>([
                [
                    'Chinese',
                    [
                        { id: '268', expansion: '皇舆争霸' },
                        { id: '269', expansion: '皇舆争霸' },
                    ],
                ],
                [
                    'Czech',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'Dutch',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'Finnish',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'French',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'German',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'Greek',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'Hungarian',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'Italian',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'Japanese',
                    [
                        { id: '268', expansion: 'ドミニオン' },
                        { id: '269', expansion: 'ドミニオン' },
                    ],
                ],
                [
                    'Korean',
                    [
                        { id: '268', expansion: '도미니언' },
                        { id: '269', expansion: '도미니언' },
                    ],
                ],
                [
                    'Norwegian',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'Polish',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'Romanian',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'Russian',
                    [
                        { id: '268', expansion: 'Доминион' },
                        { id: '269', expansion: 'Доминион' },
                    ],
                ],
                [
                    'Spanish',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
                [
                    'Swedish',
                    [
                        { id: '268', expansion: 'Dominion' },
                        { id: '269', expansion: 'Dominion' },
                    ],
                ],
            ]);

            const actual = editionTranslationBuilder.build(expansionPage, editions);

            expect(actual).toEqual(expected);
        });

        it('with single edition should return correct translations', () => {
            const expansionPage: ExpansionPage = {
                pageid: 100,
                title: 'Alchemy',
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `=== Official releases in other languages ===\n` +
                                    `* Czech: Alchymie\n` +
                                    `* Dutch: De Alchemisten (lit. ''the alchemists'')\n` +
                                    `** No longer available. In 2019 999 games combined ...\n` +
                                    `* Finnish: Alkemia`,
                            },
                        },
                    },
                ],
            };
            const editions: CargoEdition[] = [
                {
                    Id: '148',
                    PageId: '100',
                    Expansion: 'Alchemy',
                    Edition: '1',
                    Icon: 'Alchemy_icon.png',
                },
            ];
            const expected = new Map<string, EditionTranslation[]>([
                ['Czech', [{ id: '148', expansion: 'Alchymie' }]],
                ['Dutch', [{ id: '148', expansion: 'De Alchemisten' }]],
                ['Finnish', [{ id: '148', expansion: 'Alkemia' }]],
            ]);

            const actual = editionTranslationBuilder.build(expansionPage, editions);

            expect(actual).toEqual(expected);
        });

        it('with release announcement should return correct translations', () => {
            const expansionPage: ExpansionPage = {
                pageid: 200,
                title: 'Allies',
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `=== Official releases in other languages ===\n` +
                                    `* Dutch (release March 16, 2022): Bondgenoten\n` +
                                    `* German (release March 28, 2022): Verbündete\n` +
                                    `* Japanese (release announced for 2022 or later): 同盟\n` +
                                    `* Korean (release announced for 2022): 도미니언: 굳건한 동맹`,
                            },
                        },
                    },
                ],
            };
            const editions: CargoEdition[] = [
                {
                    Id: '300',
                    PageId: '200',
                    Expansion: 'Allies',
                    Edition: '1',
                    Icon: 'Allies_icon.png',
                },
            ];
            const expected = new Map<string, EditionTranslation[]>([
                ['Dutch', [{ id: '300', expansion: 'Bondgenoten' }]],
                ['German', [{ id: '300', expansion: 'Verbündete' }]],
                ['Japanese', [{ id: '300', expansion: '同盟' }]],
                ['Korean', [{ id: '300', expansion: '도미니언' }]],
            ]);

            const actual = editionTranslationBuilder.build(expansionPage, editions);

            expect(actual).toEqual(expected);
        });
    });
});
