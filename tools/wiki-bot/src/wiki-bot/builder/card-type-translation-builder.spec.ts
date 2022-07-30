import { CardTypeTranslation } from './../../../../../src/app/models/card-type';
import { CardTypePage } from './../wiki-client/api-models';
import { CardTypeTranslationBuilder } from './card-type-translation-builder';

describe('CardTypeTranslationBuilder', () => {
    let cardTypeTranslationBuilder: CardTypeTranslationBuilder;

    beforeEach(() => {
        cardTypeTranslationBuilder = new CardTypeTranslationBuilder();
    });

    describe('build', () => {
        it('should return correct translations', () => {
            const cardTypePage: CardTypePage = {
                pageid: 216,
                title: 'Action',
                fullurl: 'http://wiki.dominionstrategy.com/index.php/Knight',
                revisions: [
                    {
                        '*':
                            `=== In other languages ===\n` +
                            `* Czech: Akce\n` +
                            `* Dutch: Actie\n` +
                            `* Finnish: Toiminta\n` +
                            `* French: Action\n` +
                            `* German: Aktion\n` +
                            `* Italian: Azione\n` +
                            `* Polish: Akcja\n` +
                            `* Russian: Действие (pron. ''dyeystviye'')`,
                    },
                ],
            };
            const expected: Map<string, CardTypeTranslation> = new Map([
                ['Czech', { id: cardTypePage.pageid, name: 'Akce' }],
                ['Dutch', { id: cardTypePage.pageid, name: 'Actie' }],
                ['Finnish', { id: cardTypePage.pageid, name: 'Toiminta' }],
                ['French', { id: cardTypePage.pageid, name: 'Action' }],
                ['German', { id: cardTypePage.pageid, name: 'Aktion' }],
                ['Italian', { id: cardTypePage.pageid, name: 'Azione' }],
                ['Polish', { id: cardTypePage.pageid, name: 'Akcja' }],
                ['Russian', { id: cardTypePage.pageid, name: 'Действие' }],
            ]);

            const actual = cardTypeTranslationBuilder.build(cardTypePage);

            expect(actual).toEqual(expected);
        });
    });
});
