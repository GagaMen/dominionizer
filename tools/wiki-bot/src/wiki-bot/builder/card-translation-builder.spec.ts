import { CardTranslation } from '../../../../../src/app/models/card';
import { CardPage, CardTypePage, CargoCard } from '../wiki-client/api-models';
import { CardTranslationBuilder } from './card-translation-builder';

describe('CardTranslationBuilder', () => {
    let cardTranslationBuilder: CardTranslationBuilder;

    const nullCardPage: CardPage = {
        pageid: 0,
        title: '',
        fullurl: '',
        revisions: [],
    };

    const nullCargoCard: CargoCard = {
        PageId: '',
        Name: '',
        Expansion: '',
        Purpose: '',
        CostCoin: '',
        CostPotion: '',
        CostDebt: '',
        CostExtra: '',
        Art: '',
        Illustrator: '',
        Edition: '',
        Types: '',
    };

    beforeEach(() => {
        cardTranslationBuilder = new CardTranslationBuilder();
    });

    describe('build', () => {
        it('with basic translation should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 247,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `===Other language versions===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Digital !! Text\n` +
                                    ` |-\n` +
                                    `!German \n| Platin {{nowrap| (lit. ...)}} || || || {{Cost|5|xl|}}\n` +
                                    `|-\n` +
                                    `!Polish \n| {{nowrap|Platyna}} || || || {{Cost|5}} \n` +
                                    `|-\n` +
                                    `!French \n| Argent || || || {{Cost|3}} \n` +
                                    ` |}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                PageId: '247',
            };
            const expected = new Map<string, CardTranslation>([
                [
                    'German',
                    {
                        id: '247',
                        name: 'Platin',
                        description: `{{Cost|5|xl|}}`,
                    },
                ],
                [
                    'Polish',
                    {
                        id: '247',
                        name: 'Platyna',
                        description: `{{Cost|5}}`,
                    },
                ],
                [
                    'French',
                    {
                        id: '247',
                        name: 'Argent',
                        description: `{{Cost|3}}`,
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with translations in template form should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 20,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `{{StartCardLangVersions}}\n` +
                                    `{{CardLangVersion|Czech| Vesnice | }}\n` +
                                    `{{CardLangVersion|German| Dorf | '''+1&nbsp;Karte'''<br>'''+2&nbsp;Aktionen''' | d=g }}\n` +
                                    `{{CardLangVersion|Japanese| 村 (pron. ''mura'') | '''+1 カードを引く''' }}\n` +
                                    `{{EndCardLangVersions}}\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                PageId: '20',
            };
            const expected = new Map<string, CardTranslation>([
                ['Czech', { id: '20', name: 'Vesnice', description: '' }],
                [
                    'German',
                    {
                        id: '20',
                        name: 'Dorf',
                        description: `'''+1&nbsp;Karte'''<br>'''+2&nbsp;Aktionen'''`,
                    },
                ],
                ['Japanese', { id: '20', name: '村', description: `'''+1 カードを引く'''` }],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with template form and named argument before the language should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 4404,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `{{StartCardLangVersions}}\n` +
                                    `{{CardLangVersion|l=1|French| Convocation (lit. ''meeting'') | Recevez jusqu'à {{Cost|4}}. }}\n` +
                                    `{{EndCardLangVersions}}\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                PageId: '4404',
            };
            const expected = new Map<string, CardTranslation>([
                [
                    'French',
                    {
                        id: '4404',
                        name: 'Convocation',
                        description: `Recevez jusqu'à {{Cost|4}}.`,
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with multiple template form entries per language should return the latest one', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 3502,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `{{StartCardLangVersions}}\n` +
                                    `{{CardLangVersion|French|r=2| Artisan | Recevez en main une carte. | o=1 }}\n` +
                                    `{{CardLangVersion|French|r=0| Artisane | Recevez dans votre main une carte. | Seconde édition (2016) }}\n` +
                                    `{{EndCardLangVersions}}\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                PageId: '3502',
            };
            const expected = new Map<string, CardTranslation>([
                [
                    'French',
                    {
                        id: '3502',
                        name: 'Artisane',
                        description: 'Recevez dans votre main une carte.',
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with latest template form entry lacking a description should return the latest one having one', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 317,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `{{StartCardLangVersions}}\n` +
                                    `{{CardLangVersion|German|r=2| Altar | Entsorge eine deiner Handkarten. | [[ASS]] (Nachdruck 2019) | o=1 }}\n` +
                                    `{{CardLangVersion|German|r=0| Altar |  | [[Hans im Glück]] | d=s }}\n` +
                                    `{{EndCardLangVersions}}\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                PageId: '317',
            };
            const expected = new Map<string, CardTranslation>([
                [
                    'German',
                    {
                        id: '317',
                        name: 'Altar',
                        description: 'Entsorge eine deiner Handkarten.',
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with template form entries lacking a description at all should return empty descriptions', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 577,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `{{StartCardLangVersions}}\n` +
                                    `{{CardLangVersion|Russian|  |  | d=g }}\n` +
                                    `{{EndCardLangVersions}}\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                PageId: '577',
            };
            const expected = new Map<string, CardTranslation>([
                ['Russian', { id: '577', name: '', description: '' }],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with template form and missing end template should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 212,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `{{StartCardLangVersions}}\n` +
                                    `{{CardLangVersion|German| Fluch | {{VP|-1|l}} | (2019) | d=g }}\n` +
                                    `\n` +
                                    `== Trivia ==\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                PageId: '212',
            };
            const expected = new Map<string, CardTranslation>([
                ['German', { id: '212', name: 'Fluch', description: `{{VP|-1|l}}` }],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with commented out template form entry should ignore it', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 20,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `{{StartCardLangVersions}}\n` +
                                    `{{CardLangVersion|Czech| Vesnice | }}\n` +
                                    `<!--{{CardLangVersion|Greek| Χωριό | }}-->\n` +
                                    `{{EndCardLangVersions}}\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                PageId: '20',
            };
            const expected = new Map<string, CardTranslation>([
                ['Czech', { id: '20', name: 'Vesnice', description: '' }],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with html markup in template form should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 3500,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `{{StartCardLangVersions}}\n` +
                                    `{{CardLangVersion|German| Banditin<br>(Note: explicitly feminine) | Nimm ein Gold.<br/>Jeder Mitspieler.<hr style="width:50%">Ende | (2019) }}\n` +
                                    `{{EndCardLangVersions}}\n`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                PageId: '3500',
            };
            const expected = new Map<string, CardTranslation>([
                [
                    'German',
                    {
                        id: '3500',
                        name: 'Banditin',
                        description: 'Nimm ein Gold.<br>Jeder Mitspieler.{{divline}}Ende',
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with different heading should return correct translations', () => {
            const cardTypePage: CardTypePage = {
                ...nullCardPage,
                pageid: 6107,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `=== In other languages ===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Text\n` +
                                    `|-\n` +
                                    `!Dutch \n| Project || || Project\n` +
                                    `|-\n` +
                                    `!German \n| Projekt || ||\n` +
                                    `|}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                PageId: '6107',
            };
            const expected = new Map<string, CardTranslation>([
                [
                    'Dutch',
                    {
                        id: '6107',
                        name: 'Project',
                        description: `Project`,
                    },
                ],
                [
                    'German',
                    {
                        id: '6107',
                        name: 'Projekt',
                        description: ``,
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardTypePage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with notes column should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `===Other language versions===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Digital !! Text !! Notes\n` +
                                    `|-\n` +
                                    `!German \n| Burggraben ||  || || '''+2 Karten''' || HiG translation error...\n` +
                                    `|}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = { ...nullCargoCard, PageId: '10' };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        name: 'Burggraben',
                        description: `'''+2 Karten'''`,
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with card back column should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `===Other language versions===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Card back !! Digital !! style="width:22%"| Text !! Release\n` +
                                    `|-\n` +
                                    `!German \n| Geldversteck || || {{CardVersionImage|Stash-back-2}} || || {{Cost|2|l}}... || \n` +
                                    `|}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = { ...nullCargoCard, PageId: '11' };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        name: 'Geldversteck',
                        description: `{{Cost|2|l}}...`,
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('without translation for description should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `===Other language versions===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Digital !! Text\n` +
                                    `|-\n` +
                                    `!German \n| || || || style="..."| \n` +
                                    `|}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = { ...nullCargoCard, PageId: '12' };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: '',
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with <br/> in translation should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `=== Other language versions ===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Digital !! Text\n` +
                                    `|-\n` +
                                    `!German\n| ||  || || '''+1 Karte'''<br/>Ignoriere... \n` +
                                    `|}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = { ...nullCargoCard, PageId: '13' };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: `'''+1 Karte'''<br>Ignoriere...`,
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with <hr> in translation should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `=== Other language versions ===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Digital !! Text\n` +
                                    `|-\n` +
                                    `!German\n| ||  || || '''+1 Karte'''<hr>Ignoriere... \n` +
                                    `|-\n` +
                                    `!French\n| ||  || || {{Cost|6|l}}<hr style="...">Lorsque vous... \n` +
                                    `|}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = { ...nullCargoCard, PageId: '14' };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: `'''+1 Karte'''{{divline}}Ignoriere...`,
                    }),
                ],
                [
                    'French',
                    jasmine.objectContaining<CardTranslation>({
                        description: `{{Cost|6|l}}{{divline}}Lorsque vous...`,
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with styles in translation should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `=== Other language versions ===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Digital !! Text\n` +
                                    `|-\n` +
                                    `!German\n| style="..."| Wache ||  || || style="..."| +{{Cost|2}}... \n` +
                                    `|}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = { ...nullCargoCard, PageId: '15' };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        name: 'Wache',
                        description: `+{{Cost|2}}...`,
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with unnecessary row separator at the end should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `===Other language versions===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Digital !! Text\n` +
                                    `|-\n` +
                                    `!German \n| || || || \n` +
                                    `|-\n` +
                                    `|}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = { ...nullCargoCard, PageId: '16' };
            const expected = new Map([
                ['German', jasmine.objectContaining<CardTranslation>({ description: '' })],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with rowspan for language should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `===Other language versions===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Digital !! Text !! Notes\n` +
                                    `|-\n` +
                                    `!rowspan=3|German\n| Brücke || || || '''+1 Kauf'''<br>+{{Cost|1}}<br>Alle Karten... ||\n` +
                                    `|- \n` +
                                    `| Brücke || || || '''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten alle Karten... ||\n` +
                                    `|- \n` +
                                    `| Brücke || || || '''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten Karten... || \n` +
                                    `|- \n` +
                                    `! rowspan="2" |Russian \n| Мост<br>(pron. ''most'') || || || '''+1 Покупка'''<br>+{{Cost|1}}... ||\n` +
                                    `|-\n` +
                                    `| Мост<br>(pron. ''most'') || || || '''+1 Покупка'''<br>+{{Cost|1}}В этом... ||\n` +
                                    `|}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = { ...nullCargoCard, PageId: '17' };
            const expected = new Map<string, CardTranslation>([
                [
                    'German',
                    {
                        id: '17',
                        name: 'Brücke',
                        description: `'''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten Karten...`,
                    },
                ],
                [
                    'Russian',
                    {
                        id: '17',
                        name: 'Мост',
                        description: `'''+1 Покупка'''<br>+{{Cost|1}}В этом...`,
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with translation contains html comments should return correct translation', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `===Other language versions===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Digital !! style="width:22%"| Text \n` +
                                    `<!--|-\n` +
                                    `!Chinese \n| || || || -->\n` +
                                    `|-\n` +
                                    `!German \n| Große Halle <!--Grosse Halle--> || || || \n` +
                                    `|}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = { ...nullCargoCard, PageId: '18' };
            const expected = new Map([
                ['German', { id: '18', name: 'Große Halle', description: jasmine.anything() }],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });

        it('with rowspan for card name should return correct translation', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        slots: {
                            main: {
                                '*':
                                    `===Other language versions===\n` +
                                    `{| class="wikitable" style="text-align:center;"\n` +
                                    `! Language !! Name !! Print !! Digital !! Text !! Notes\n` +
                                    `|-\n` +
                                    `!rowspan=3|German\n| rowspan=3|Brücke || || || '''+1 Kauf'''<br>+{{Cost|1}}<br>Alle Karten... ||\n` +
                                    `|- \n` +
                                    `| || || '''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten alle Karten... ||\n` +
                                    `|- \n` +
                                    `| || || '''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten Karten... || \n` +
                                    `|- \n` +
                                    `! rowspan="2" |Russian \n| rowspan="2" |Мост<br>(pron. ''most'') || || || '''+1 Покупка'''<br>+{{Cost|1}}... ||\n` +
                                    `|-\n` +
                                    `| || || '''+1 Покупка'''<br>+{{Cost|1}}В этом... ||\n` +
                                    `|}`,
                            },
                        },
                    },
                ],
            };
            const cargoCard: CargoCard = { ...nullCargoCard, PageId: '19' };
            const expected = new Map<string, CardTranslation>([
                [
                    'German',
                    {
                        id: '19',
                        name: 'Brücke',
                        description: `'''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten Karten...`,
                    },
                ],
                [
                    'Russian',
                    {
                        id: '19',
                        name: 'Мост',
                        description: `'''+1 Покупка'''<br>+{{Cost|1}}В этом...`,
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cargoCard);

            expect(actual).toEqual(expected);
        });
    });
});
