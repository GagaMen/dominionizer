import { CardTranslation } from './../../../../../src/app/models/card';
import { CardTypeTranslation } from './../../../../../src/app/models/card-type';
import { CardTypePage, CargoCardType } from './../wiki-client/api-models';
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
                Id: '273',
                PageId: '273',
                Name: 'Prize',
                Scope: 'Single-pile',
            };
            const expected = new Map<string, CardTypeTranslation>([
                ['Czech', { id: '273', name: 'Odměna' }],
                ['Dutch', { id: '273', name: 'Prijs' }],
                ['Finnish', { id: '273', name: 'Palkinto' }],
                ['German', { id: '273', name: 'Preis' }],
                ['Polish', { id: '273', name: 'Nagroda' }],
                ['Russian', { id: '273', name: 'Трофей' }],
            ]);

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
                Id: '300',
                PageId: '300',
                Name: 'Project',
                Scope: 'Landscape',
            };
            const cardTranslations = new Map<string, CardTranslation>([
                ['Dutch', { id: '300', name: 'Project', description: 'Project' }],
                ['German', { id: '300', name: 'Projekt', description: '' }],
            ]);
            const expected = new Map<string, CardTypeTranslation>([
                ['Dutch', { id: '300', name: 'Project' }],
                ['German', { id: '300', name: 'Projekt' }],
            ]);
            cardTranslationBuilderSpy.build
                .withArgs(cardTypePage, cargoCardType)
                .and.returnValue(cardTranslations);

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
                Id: '263',
                PageId: '263',
                Name: 'Knight',
                Scope: 'Single-pile',
            };
            const cardTranslations = new Map<string, CardTranslation>([
                ['French', { id: '263', name: 'Chevalier', description: '' }],
                ['German', { id: '263', name: 'Ritter', description: '' }],
            ]);
            const expected = new Map<string, CardTypeTranslation>([
                ['French', { id: '263', name: 'Chevalier' }],
                ['German', { id: '263', name: 'Ritter' }],
            ]);
            cardTranslationBuilderSpy.build
                .withArgs(cardTypePage, cargoCardType)
                .and.returnValue(cardTranslations);

            const actual = cardTypeTranslationBuilder.build(cardTypePage, cargoCardType);

            expect(actual).toEqual(expected);
        });
    });
});
