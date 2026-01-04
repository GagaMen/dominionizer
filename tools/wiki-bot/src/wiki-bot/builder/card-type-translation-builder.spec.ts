import { CardTranslation } from './../../../../../src/app/models/card';
import { CardTypeTranslation } from './../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { CardTranslationBuilder } from './card-translation-builder';
import { CardTypeTranslationBuilder } from './card-type-translation-builder';

describe('CardTypeTranslationBuilder', () => {
    let cardTypeTranslationBuilder: CardTypeTranslationBuilder;
    let cardTranslationBuilderSpy: jasmine.SpyObj<CardTranslationBuilder>;

    beforeEach(() => {
        cardTranslationBuilderSpy = jasmine.createSpyObj<CardTranslationBuilder>(
            'CardTranslationBuilder',
            ['build'],
        );

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
                ],
            };
            const expected = new Map<string, CardTypeTranslation>([
                ['Czech', { id: cardTypePage.pageid, name: 'Odměna' }],
                ['Dutch', { id: cardTypePage.pageid, name: 'Prijs' }],
                ['Finnish', { id: cardTypePage.pageid, name: 'Palkinto' }],
                ['German', { id: cardTypePage.pageid, name: 'Preis' }],
                ['Polish', { id: cardTypePage.pageid, name: 'Nagroda' }],
                ['Russian', { id: cardTypePage.pageid, name: 'Трофей' }],
            ]);

            const actual = cardTypeTranslationBuilder.build(cardTypePage);

            expect(actual).toEqual(expected);
        });

        it('with translations in table form for card type should return correct translations', () => {
            const cardTypePage: CardTypePage = {
                pageid: 6107,
                title: 'Project',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Project',
                revisions: [
                    {
                        '*':
                            `=== In other languages ===\n` +
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Text\n` +
                            `|}\n\n`,
                    },
                ],
            };
            const cardTranslations = new Map<string, CardTranslation>([
                ['Dutch', { id: cardTypePage.pageid, name: 'Project', description: '' }],
                ['German', { id: cardTypePage.pageid, name: 'Projekt', description: '' }],
            ]);
            const expected = new Map<string, CardTypeTranslation>([
                ['Dutch', { id: cardTypePage.pageid, name: 'Project' }],
                ['German', { id: cardTypePage.pageid, name: 'Projekt' }],
            ]);
            cardTranslationBuilderSpy.build
                .withArgs(cardTypePage)
                .and.returnValue(cardTranslations);

            const actual = cardTypeTranslationBuilder.build(cardTypePage);

            expect(actual).toEqual(expected);
        });

        it('with translations in table form for card should return correct translations', () => {
            const cardTypePage: CardTypePage = {
                pageid: 577,
                title: 'Knight',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Knight',
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `In general, the specific names...\n` +
                            `{| class="wikitable" style="text-align:center;"\n` +
                            `! Language !! Name !! Print !! Digital !! Text !! Notes\n` +
                            `|}\n\n`,
                    },
                ],
            };
            const cardTranslations = new Map<string, CardTranslation>([
                ['French', { id: cardTypePage.pageid, name: 'Chevalier', description: '' }],
                ['German', { id: cardTypePage.pageid, name: 'Ritter', description: '' }],
            ]);
            const expected = new Map<string, CardTypeTranslation>([
                ['French', { id: cardTypePage.pageid, name: 'Chevalier' }],
                ['German', { id: cardTypePage.pageid, name: 'Ritter' }],
            ]);
            cardTranslationBuilderSpy.build
                .withArgs(cardTypePage)
                .and.returnValue(cardTranslations);

            const actual = cardTypeTranslationBuilder.build(cardTypePage);

            expect(actual).toEqual(expected);
        });
    });
});
