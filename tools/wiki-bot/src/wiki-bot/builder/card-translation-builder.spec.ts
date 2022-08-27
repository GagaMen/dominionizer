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
            const cardDto: CardDto = {
                ...NullCardDto,
                id: 247,
                description: [`{{Cost|5|xl}}`],
            };
            const expected: Map<string, CardTranslation> = new Map([
                [
                    'German',
                    {
                        id: cardPage.pageid,
                        name: 'Platin',
                        description: [`{{Cost|5|xl|}}`],
                    },
                ],
                [
                    'Polish',
                    {
                        id: cardPage.pageid,
                        name: '{{nowrap|Platyna}}',
                        description: [`{{Cost|5}}`],
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
                            `{| class="wikitable" style="text-align:center;"\n` +
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
                            `{| class="wikitable" style="text-align:center;"\n` +
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
                            `{| class="wikitable" style="text-align:center;"\n` +
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

        it('with <br>, <br/>, <hr> or {{divline}} in text1 and without text2 should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `=== Other language versions ===\n` +
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German\n| ||  || || '''+1 Karte'''<br>'''+4 Aktionen'''<br/>{{Cost|1}}<hr>Ignoriere...{{divline}}die... \n` +
                            `|}`,
                    },
                ],
            };
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`'''+1 Card'''<br>'''+4 Actions'''<br>{{Cost|1}}<br>Ignore...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: [
                            `'''+1 Karte'''<br>'''+4 Aktionen'''<br>{{Cost|1}}<br>Ignoriere...<br>die...`,
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
                            `{| class="wikitable" style="text-align:center;"\n` +
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
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`'''+1 Card'''`, `Ignore...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: [`'''+1 Karte'''`, `Ignoriere...`],
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
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`'''+1 Card'''`, `Ignore...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: [`'''+1 Karte'''`, `Ignoriere...`],
                    }),
                ],
                [
                    'French',
                    jasmine.objectContaining<CardTranslation>({
                        description: [`{{Cost|6|l}}`, `Lorsque vous...`],
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
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German\n| ||  || || '''+1 Karte'''\nIgnoriere... \n` +
                            `|}`,
                    },
                ],
            };
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`'''+1 Card'''`, `Ignore...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: [`'''+1 Karte'''`, `Ignoriere...`],
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cardDto);

            expect(actual).toEqual(expected);
        });

        it('with {{divline}} in translation should return card translation with correct description', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `=== Other language versions ===\n` +
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Digital !! Text\n` +
                            `|-\n` +
                            `!German\n| ||  || || Nimm dir 3 Kupfer...{{divline}}Wenn ein Mitspieler... \n` +
                            `|}`,
                    },
                ],
            };
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`Gain 3 Coppers...`, `When another player...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        description: [`Nimm dir 3 Kupfer...`, `Wenn ein Mitspieler...`],
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cardDto);

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
            const cardDto: CardDto = {
                ...NullCardDto,
                description: [`+{{Cost|2}}...`],
            };
            const expected = new Map([
                [
                    'German',
                    jasmine.objectContaining<CardTranslation>({
                        name: 'Wache',
                        description: [`+{{Cost|2}}...`],
                    }),
                ],
            ]);

            const actual = cardTranslationBuilder.build(cardPage, cardDto);

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
            const expected = new Map([['German', jasmine.anything()]]);

            const actual = cardTranslationBuilder.build(cardPage, NullCardDto);

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
                        description: [
                            `'''+1 Kauf'''<br>+{{Cost|1}}<br>In diesem Zug kosten Karten...`,
                        ],
                    },
                ],
                [
                    'Russian',
                    {
                        id: cardPage.pageid,
                        name: 'Мост',
                        description: [`'''+1 Покупка'''<br>+{{Cost|1}}В этом...`],
                    },
                ],
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
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Digital !! style="width:22%"| Text \n` +
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

            const actual = cardTranslationBuilder.build(cardPage, NullCardDto);

            expect(actual).toEqual(expected);
        });
    });
});
