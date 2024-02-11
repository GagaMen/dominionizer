import { CardTranslation } from '../../../../../src/app/models/card';
import { CardPage, CardTypePage } from '../wiki-client/api-models';
import { CardTranslationBuilder } from './card-translation-builder';

describe('CardTranslationBuilder', () => {
    let cardTranslationBuilder: CardTranslationBuilder;

    const nullCardPage: CardPage = {
        pageid: 0,
        title: '',
        fullurl: '',
        revisions: [],
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
                        '*':
                            `===Other language versions===\n` +
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            ` |-\n` +
                            `!German \n| Platin {{nowrap| (lit. ...)}} || || || {{Cost|5|xl|}}\n` +
                            `|-\n` +
                            `!Polish \n| {{nowrap|Platyna}} || || || {{Cost|5}} \n` +
                            ` |}`,
                    },
                ],
            };
            const expected: Map<string, CardTranslation> = new Map([
                [
                    'German',
                    {
                        id: cardPage.pageid,
                        name: 'Platin',
                        description: `{{Cost|5|xl|}}`,
                    },
                ],
                [
                    'Polish',
                    {
                        id: cardPage.pageid,
                        name: '{{nowrap|Platyna}}',
                        description: `{{Cost|5}}`,
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with different heading should return correct translations', () => {
            const cardTypePage: CardTypePage = {
                ...nullCardPage,
                pageid: 6107,
                revisions: [
                    {
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
                ],
            };
            const expected: Map<string, CardTranslation> = new Map([
                [
                    'Dutch',
                    {
                        id: cardTypePage.pageid,
                        name: 'Project',
                        description: `Project`,
                    },
                ],
                [
                    'German',
                    {
                        id: cardTypePage.pageid,
                        name: 'Projekt',
                        description: ``,
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardTypePage);

            expect(actual).toEqual(expected);
        });

        it('with notes column should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Digital !! Text !! Notes\n` +
                            `|-\n` +
                            `!German \n| Burggraben ||  || || '''+2 Karten''' || HiG translation error...\n` +
                            `|}`,
                    },
                ],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        name: 'Burggraben',
                        description: `'''+2 Karten'''`,
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with card back column should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Card back !! Digital !! style="width:22%"| Text !! Release\n` +
                            `|-\n` +
                            `!German \n| Geldversteck || || {{CardVersionImage|Stash-back-2}} || || {{Cost|2|l}}... || \n` +
                            `|}`,
                    },
                ],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        name: 'Geldversteck',
                        description: `{{Cost|2|l}}...`,
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('without translation for description should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German \n| || || || style="..."| \n` +
                            `|}`,
                    },
                ],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: '',
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with <br/> in translation should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `=== Other language versions ===\n` +
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German\n| ||  || || '''+1 Karte'''<br/>Ignoriere... \n` +
                            `|}`,
                    },
                ],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: `'''+1 Karte'''<br>Ignoriere...`,
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with <hr> in translation should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
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
                ],
            };
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

            const actual = cardTranslationBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with styles in translation should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `=== Other language versions ===\n` +
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German\n| style="..."| Wache ||  || || style="..."| +{{Cost|2}}... \n` +
                            `|}`,
                    },
                ],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        name: 'Wache',
                        description: `+{{Cost|2}}...`,
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with unnecessary row separator at the end should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German \n| || || || \n` +
                            `|-\n` +
                            `|}`,
                    },
                ],
            };
            const expected = new Map([
                ['German', jasmine.objectContaining<CardTranslation>({ description: '' })],
            ]);

            const actual = cardTranslationBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with rowspan for language should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
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
                ],
            };
            const expected: Map<string, CardTranslation> = new Map([
                [
                    'German',
                    {
                        id: cardPage.pageid,
                        name: 'Brücke',
                        description: `'''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten Karten...`,
                    },
                ],
                [
                    'Russian',
                    {
                        id: cardPage.pageid,
                        name: 'Мост',
                        description: `'''+1 Покупка'''<br>+{{Cost|1}}В этом...`,
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with translation contains html comments should return correct translation', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
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
                ],
            };
            const expected = new Map([
                [
                    'German',
                    { id: cardPage.pageid, name: 'Große Halle', description: jasmine.anything() },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });

        it('with rowspan for card name should return correct translation', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
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
                ],
            };
            const expected: Map<string, CardTranslation> = new Map([
                [
                    'German',
                    {
                        id: cardPage.pageid,
                        name: 'Brücke',
                        description: `'''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten Karten...`,
                    },
                ],
                [
                    'Russian',
                    {
                        id: cardPage.pageid,
                        name: 'Мост',
                        description: `'''+1 Покупка'''<br>+{{Cost|1}}В этом...`,
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage);

            expect(actual).toEqual(expected);
        });
    });
});
