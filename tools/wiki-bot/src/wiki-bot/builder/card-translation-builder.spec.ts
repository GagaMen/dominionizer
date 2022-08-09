import { CardTranslation } from '../../../../../src/app/models/card';
import { CardDto, NullCardDto } from '../../../../../src/app/dtos/card-dto';
import { CardPage } from '../wiki-client/api-models';
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
                pageid: 18,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class=\\"wikitable\\" style=\\"text-align:center;\\"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German \n| Burggraben ||  || || '''+2 Karten'''\n` +
                            `|}`,
                    },
                ],
            };
            const cardDto: CardDto = {
                ...NullCardDto,
                id: 18,
                description: [`'''+2 Cards'''`],
            };
            const expected: Map<string, CardTranslation> = new Map([
                [
                    'German',
                    {
                        id: cardPage.pageid,
                        name: 'Burggraben',
                        description: [`'''+2 Karten'''`],
                    },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cardDto);

            expect(actual).toEqual(expected);
        });

        it('with notes column should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class=\\"wikitable\\" style=\\"text-align:center;\\"\n` +
                            `! Language !! Name !! Print !! Digital !! Text !! Notes\n` +
                            `|-\n` +
                            `!German \n| Burggraben ||  || || '''+2 Karten''' <br> Wenn ein Mitspieler... || HiG translation error...\n` +
                            `|}`,
                    },
                ],
            };
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`'''+2 Cards'''`, `When another player...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        name: 'Burggraben',
                        description: [`'''+2 Karten'''`, `Wenn ein Mitspieler...`],
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cardDto);

            expect(actual).toEqual(expected);
        });

        it('without translation for description should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class=\\"wikitable\\" style=\\"text-align:center;\\"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German \n| || || || \n` +
                            `|}`,
                    },
                ],
            };
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`'''+2 Cards'''`, `When another player...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: [],
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cardDto);

            expect(actual).toEqual(expected);
        });

        it('with cardDto contains text1 and text2 should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class=\\"wikitable\\" style=\\"text-align:center;\\"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German \n| ||  || || '''+2 Karten''' <br> Wenn ein Mitspieler...\n` +
                            `|}`,
                    },
                ],
            };
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`'''+2 Cards'''`, `When another player...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: [`'''+2 Karten'''`, `Wenn ein Mitspieler...`],
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cardDto);

            expect(actual).toEqual(expected);
        });

        it('with multiple <br> in text1 and without text2 should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `=== Other language versions ===\n` +
                            `{| class=\\"wikitable\\" style=\\"text-align:center;\\"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German\n| ||  || || '''+1 Karte'''<br>'''+4 Aktionen'''<br>Ignoriere...<br>die... \n` +
                            `|}`,
                    },
                ],
            };
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`'''+1 Card'''<br>'''+4 Actions'''<br>Ignore...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: [
                            `'''+1 Karte'''<br>'''+4 Aktionen'''<br>Ignoriere...<br>die...`,
                        ],
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cardDto);

            expect(actual).toEqual(expected);
        });

        it('with multiple <br> in text1 and text2 should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `=== Other language versions ===\n` +
                            `{| class=\\"wikitable\\" style=\\"text-align:center;\\"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German\n| ||  || || '''+1 Karte'''<br>'''+4 Aktionen'''<br>Ignoriere... <br>die... \n` +
                            `|}`,
                    },
                ],
            };
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`'''+1 Card'''<br>'''+4 Actions'''`, `Ignore...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: [
                            `'''+1 Karte'''<br>'''+4 Aktionen'''`,
                            `Ignoriere... <br>die...`,
                        ],
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cardDto);

            expect(actual).toEqual(expected);
        });

        it('with <hr> in translation should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `=== Other language versions ===\n` +
                            `{| class=\\"wikitable\\" style=\\"text-align:center;\\"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German\n| ||  || || '''+1 Karte'''<br>'''+4 Aktionen'''<hr>Ignoriere... <br>die... \n` +
                            `|}`,
                    },
                ],
            };
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`'''+1 Card'''<br>'''+4 Actions'''`, `Ignore...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: [
                            `'''+1 Karte'''<br>'''+4 Aktionen'''`,
                            `Ignoriere... <br>die...`,
                        ],
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cardDto);

            expect(actual).toEqual(expected);
        });

        it('with \\n in translation should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `=== Other language versions ===\n` +
                            `{| class=\\"wikitable\\" style=\\"text-align:center;\\"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German\n| ||  || || '''+1 Karte'''<br>'''+4 Aktionen'''\nIgnoriere... <br>die... \n` +
                            `|}`,
                    },
                ],
            };
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`'''+1 Card'''<br>'''+4 Actions'''`, `Ignore...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: [
                            `'''+1 Karte'''<br>'''+4 Aktionen'''`,
                            `Ignoriere... <br>die...`,
                        ],
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cardDto);

            expect(actual).toEqual(expected);
        });

        it('with multiple translations should return translations for each language', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class=\\"wikitable\\" style=\\"text-align:center;\\"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!Czech \n| || || || \n` +
                            `|-\n` +
                            `!German \n| || || || \n` +
                            `|}`,
                    },
                ],
            };
            const expected = new Map([
                ['Czech', jasmine.anything()],
                ['German', jasmine.anything()],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, NullCardDto);

            expect(actual).toEqual(expected);
        });

        it('with unnecessary row separator at the end should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class=\\"wikitable\\" style=\\"text-align:center;\\"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German \n| || || || \n` +
                            `|-\n` +
                            `|}`,
                    },
                ],
            };
            const expected = new Map([['German', jasmine.anything()]]);

            const actual = cardTranslationBuilder.build(cardPage, NullCardDto);

            expect(actual).toEqual(expected);
        });

        it('with card language table contains rowspan information should return correct translations', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class="wikitable" style="text-align:center;"\n! Language !! Name !! Print !! Digital !! Text !! Notes\n|-\n` +
                            `!Chinese \n| 橋樑 (pron. ''qiáoliáng'') || || || || \n|-\n` +
                            `!rowspan=3|German\n| Brücke || || || '''+1 Kauf'''<br>+{{Cost|1}}<br>Alle Karten (auch die Karten, die die<br>Spieler auf der Hand halten) kosten<br>in diesem Zug {{Cost|1}} weniger, niemals<br>jedoch weniger als {{Cost|0}}. ||\n|-\n` +
                            `| Brücke || || || '''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten alle Karten<br>(überall) {{Cost|1}} weniger, aber nicht<br>weniger als {{Cost|0}}. ||\n|-\n` +
                            `| Brücke || || || '''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten Karten<br>(überall) {{Cost|1}} weniger. || \n|-\n` +
                            `!Russian \n| Мост<br>(pron. ''most'') || || || '''+1 Покупка'''<br>+{{Cost|1}}<br>В этом ходу все карты (везде) стоят на {{Cost|1}} дешевле, но не меньше {{Cost|0}}. ||\n|-\n` +
                            `!Spanish \n| Puente || || || || \n|}`,
                    },
                ],
            };
            const expected: Map<string, CardTranslation> = new Map([
                ['Chinese', { id: cardPage.pageid, name: '橋樑', description: [] }],
                [
                    'German',
                    {
                        id: cardPage.pageid,
                        name: 'Brücke',
                        description: [
                            `'''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten Karten<br>(überall) {{Cost|1}} weniger.`,
                        ],
                    },
                ],
                [
                    'Russian',
                    {
                        id: cardPage.pageid,
                        name: 'Мост',
                        description: [
                            `'''+1 Покупка'''<br>+{{Cost|1}}<br>В этом ходу все карты (везде) стоят на {{Cost|1}} дешевле, но не меньше {{Cost|0}}.`,
                        ],
                    },
                ],
                ['Spanish', { id: cardPage.pageid, name: 'Puente', description: [] }],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, NullCardDto);

            expect(actual).toEqual(expected);
        });

        it('with translation contains html comments should return correct translation', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `{| class="wikitable" style="text-align:center;"\n! Language !! Name !! Print !! Digital !! style="width:22%"| Text \n|-\n` +
                            `!German \n| Große Halle <!--Grosse Halle--> || || || \n|}`,
                    },
                ],
            };
            const expected = new Map([
                [
                    'German',
                    { id: cardPage.pageid, name: 'Große Halle', description: jasmine.anything() },
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, NullCardDto);

            expect(actual).toEqual(expected);
        });
    });
});
