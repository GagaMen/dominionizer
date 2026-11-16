import { createSpyObj, SpyObj } from '../../testing/spy-obj';
import { when } from 'vitest-when';
import { CardTranslation } from './../../../../../src/app/models/card';
import { CardTypeTranslation } from './../../../../../src/app/models/card-type';
import { CardTypePage, CargoCardType } from './../wiki-client/api-models';
import { CardTranslationBuilder } from './card-translation-builder';
import { CardTypeTranslationBuilder } from './card-type-translation-builder';

describe('CardTypeTranslationBuilder', () => {
    let cardTypeTranslationBuilder: CardTypeTranslationBuilder;
    let cardTranslationBuilderSpy: SpyObj<CardTranslationBuilder>;

    beforeEach(() => {
        cardTranslationBuilderSpy = createSpyObj<CardTranslationBuilder>({
            build: vi.fn(),
        });

        cardTypeTranslationBuilder = new CardTypeTranslationBuilder(cardTranslationBuilderSpy);
    });

    describe('build', () => {
        it('with translations in list form should return correct translations', () => {
            const cardTypePage: CardTypePage = {
                pageid: 431,
                title: 'Prize',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Prize',
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `=== In other languages ===\n` +
                                    `* Czech: Odměna\n` +
                                    `* Dutch: Prijs\n` +
                                    `* Finnish: Palkinto\n` +
                                    `* German: Preis\n` +
                                    `* Polish: Nagroda\n` +
                                    `* Russian: Трофей (pron. ''trofyey'', lit. ''trophy'')\n` +
                                    `<!--* Chinese: \n` +
                                    `* French: \n` +
                                    `-->\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCardType: CargoCardType = {
                PageId: '431',
                Name: 'Prize',
                Scope: 'Single-pile',
            };
            const expected = new Map<string, CardTypeTranslation>([
                ['Czech', { id: '431', name: 'Odměna' }],
                ['Dutch', { id: '431', name: 'Prijs' }],
                ['Finnish', { id: '431', name: 'Palkinto' }],
                ['German', { id: '431', name: 'Preis' }],
                ['Polish', { id: '431', name: 'Nagroda' }],
                ['Russian', { id: '431', name: 'Трофей' }],
            ]);

            const actual = cardTypeTranslationBuilder.build(cardTypePage, cargoCardType);

            expect(actual).toEqual(expected);
        });

        it('with sub item below a named language in list form should ignore the sub item', () => {
            const cardTypePage: CardTypePage = {
                pageid: 11050,
                title: 'Shadow',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Shadow',
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `=== In other languages ===\n` +
                                    `* French: Ombre\n` +
                                    `** Lorsque vous mélangez cette carte, placez-la en dessous de votre deck.\n` +
                                    `* German: Schatten\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCardType: CargoCardType = {
                PageId: '11050',
                Name: 'Shadow',
                Scope: 'Single-expansion',
            };
            const expected = new Map<string, CardTypeTranslation>([
                ['French', { id: '11050', name: 'Ombre' }],
                ['German', { id: '11050', name: 'Schatten' }],
            ]);

            const actual = cardTypeTranslationBuilder.build(cardTypePage, cargoCardType);

            expect(actual).toEqual(expected);
        });

        it('with name only in sub item in list form should return the name of the first sub item', () => {
            const cardTypePage: CardTypePage = {
                pageid: 11050,
                title: 'Shadow',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Shadow',
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `=== In other languages ===\n` +
                                    `* French:\n` +
                                    `** Ombre (2024)\n` +
                                    `** Ombres (2025)\n` +
                                    `* German: Schatten\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCardType: CargoCardType = {
                PageId: '11050',
                Name: 'Shadow',
                Scope: 'Single-expansion',
            };
            const expected = new Map<string, CardTypeTranslation>([
                ['French', { id: '11050', name: 'Ombre' }],
                ['German', { id: '11050', name: 'Schatten' }],
            ]);

            const actual = cardTypeTranslationBuilder.build(cardTypePage, cargoCardType);

            expect(actual).toEqual(expected);
        });

        it('with translations in template form should return correct translations', () => {
            const cardTypePage: CardTypePage = {
                pageid: 577,
                title: 'Knights',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Knights',
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `{{StartCardLangVersions}}\n` +
                                    `{{CardLangVersion|French| Chevalier | }}\n` +
                                    `{{CardLangVersion|German|r=2| Ritter | Spielvorbereitung: Mischt alle Ritter. | o=1 }}\n` +
                                    `{{CardLangVersion|German|r=0| Ritter |  | d=s }}\n` +
                                    `{{EndCardLangVersions}}\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCardType: CargoCardType = {
                PageId: '577',
                Name: 'Knight',
                Scope: 'Single-pile',
            };
            const cardTranslations = new Map<string, CardTranslation>([
                ['French', { id: '577', name: 'Chevalier', description: '' }],
                [
                    'German',
                    {
                        id: '577',
                        name: 'Ritter',
                        description: 'Spielvorbereitung: Mischt alle Ritter.',
                    },
                ],
            ]);
            const expected = new Map<string, CardTypeTranslation>([
                ['French', { id: '577', name: 'Chevalier' }],
                ['German', { id: '577', name: 'Ritter' }],
            ]);
            when(cardTranslationBuilderSpy.build)
                .calledWith(cardTypePage, cargoCardType)
                .thenReturn(cardTranslations);

            const actual = cardTypeTranslationBuilder.build(cardTypePage, cargoCardType);

            expect(actual).toEqual(expected);
        });

        it('with translations in table form for card type should return correct translations', () => {
            const cardTypePage: CardTypePage = {
                pageid: 6107,
                title: 'Project',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Project',
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `=== In other languages ===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Text\n` +
                                    `|}\n\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCardType: CargoCardType = {
                PageId: '6107',
                Name: 'Project',
                Scope: 'Landscape',
            };
            const cardTranslations = new Map<string, CardTranslation>([
                ['Dutch', { id: '6107', name: 'Project', description: 'Project' }],
                ['German', { id: '6107', name: 'Projekt', description: '' }],
            ]);
            const expected = new Map<string, CardTypeTranslation>([
                ['Dutch', { id: '6107', name: 'Project' }],
                ['German', { id: '6107', name: 'Projekt' }],
            ]);
            when(cardTranslationBuilderSpy.build)
                .calledWith(cardTypePage, cargoCardType)
                .thenReturn(cardTranslations);

            const actual = cardTypeTranslationBuilder.build(cardTypePage, cargoCardType);

            expect(actual).toEqual(expected);
        });

        it('with translations in table form for card should return correct translations', () => {
            const cardTypePage: CardTypePage = {
                pageid: 577,
                title: 'Knight',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Knight',
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `===Other language versions===\n` +
                                    `In general, the specific names...\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Digital !! Text !! Notes\n` +
                                    `|}\n\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCardType: CargoCardType = {
                PageId: '577',
                Name: 'Knight',
                Scope: 'Single-pile',
            };
            const cardTranslations = new Map<string, CardTranslation>([
                ['French', { id: '577', name: 'Chevalier', description: '' }],
                ['German', { id: '577', name: 'Ritter', description: '' }],
            ]);
            const expected = new Map<string, CardTypeTranslation>([
                ['French', { id: '577', name: 'Chevalier' }],
                ['German', { id: '577', name: 'Ritter' }],
            ]);
            when(cardTranslationBuilderSpy.build)
                .calledWith(cardTypePage, cargoCardType)
                .thenReturn(cardTranslations);

            const actual = cardTypeTranslationBuilder.build(cardTypePage, cargoCardType);

            expect(actual).toEqual(expected);
        });
    });
});
