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
                pageid: 431,
                title: 'Prize',
                fullurl: 'http://wiki.dominionstrategy.com/index.php/Prize',
                revisions: [
                    {
                        '*':
                            `=== In other languages ===\n` +
                            `* Czech: Odměna\n` +
                            `* Dutch: Prijs\n` +
                            `* Finnish: Palkinto\n` +
                            `* German: Preis\n` +
                            `* Polish: Nagroda\n` +
                            `* Russian: Трофей (pron. ''trofyey'', lit. ''trophy'')`,
                    },
                ],
            };
            const expected: Map<string, CardTypeTranslation> = new Map([
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

        it('with card type page contains versions should return correct translations', () => {
            const cardTypePage: CardTypePage = {
                pageid: 577,
                title: 'Knight',
                fullurl: 'http://wiki.dominionstrategy.com/index.php/Knight',
                revisions: [
                    {
                        '*':
                            `===Other language versions===\n` +
                            `In general, the specific names of the Knights do not change in different languages.\n` +
                            `{| class="wikitable" style="text-align:center;"\n! Language !! Name !! Print !! Digital !! Text !! Notes\n|-\n` +
                            `!Czech\n| Rytíři || {{CardVersionImage|KnightsCzech|Czech language Knights}} || || Před každou hrou, v niž se používají řytíři, zamíchej jejich balíček.  Polož ho lícem dolů s výjimkou vrchní karty. Tu jedinou je možné ziskat. || \n|-\n` +
                            `!Dutch\n| Ridders || || || || \n|-\n` +
                            `!Finnish\n| Ritarit || || || || \n|-\n` +
                            `!French\n| Chevalier || || || || \n|-\n` +
                            `!German\n| Ritter || {{CardVersionImage|Knights German-HiG|German language Knights 2019 by ASS}} || || Spielvorbereitung:<br>Mischt alle Ritter, legt sie als verdeckten Stapel in den Vorrat und deckt die oberste Karte auf. Es darf immer nur die oberste Karte des Stapels genommen oder gekauft werden. || (2019)\n|-\n` +
                            `!Japanese \n| 騎士 (pron. ''kishi'')  || || || style=\"padding:15px 0px;\"| 騎士を使用する各ゲ一ムの開始前に、騎士の山をシャッフルする。一番上のカード以外は裏にする。山の一番上のカードのみ購入•獲得可能。|| \n|-\n` +
                            `!Korean\n| 기사 (pron. ''gisa'') || || || || \n|-\n` +
                            `!Polish\n| Rycerze || || || || <small>Although Polish version is not released,<br>this name is referred to in Polish Dominion 2E rulebook.</small>\n|-\n` +
                            `!Russian\n| Рыцари (pron. ''rytsari'') || || || || \n|-\n` +
                            `!Spanish\n|Caballero || ||  || \n|}`,
                    },
                ],
            };
            const expected: Map<string, CardTypeTranslation> = new Map([
                ['Czech', { id: cardTypePage.pageid, name: 'Rytíři' }],
                ['Dutch', { id: cardTypePage.pageid, name: 'Ridders' }],
                ['Finnish', { id: cardTypePage.pageid, name: 'Ritarit' }],
                ['French', { id: cardTypePage.pageid, name: 'Chevalier' }],
                ['German', { id: cardTypePage.pageid, name: 'Ritter' }],
                ['Japanese', { id: cardTypePage.pageid, name: '騎士' }],
                ['Korean', { id: cardTypePage.pageid, name: '기사' }],
                ['Polish', { id: cardTypePage.pageid, name: 'Rycerze' }],
                ['Russian', { id: cardTypePage.pageid, name: 'Рыцари' }],
                ['Spanish', { id: cardTypePage.pageid, name: 'Caballero' }],
            ]);

            const actual = cardTypeTranslationBuilder.build(cardTypePage);

            expect(actual).toEqual(expected);
        });
    });
});
