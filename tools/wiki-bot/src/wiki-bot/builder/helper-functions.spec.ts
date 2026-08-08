import { WikiText } from '../wiki-client/api-models';
import {
    extractSection,
    extractTemplate,
    extractTemplateArguments,
    extractTemplatePropertyValue,
    extractTemplates,
    normalize,
} from './helper-functions';

describe('helper functions', () => {
    describe('extractTemplate', () => {
        it('with non-existent template should return empty string', () => {
            const wikiText: WikiText =
                `{{Infobox Set\n` +
                `|othercards =* 5 {{Card|Hero|Heroes}}\n` +
                `}}\n\n` +
                `'''Adventures''' is...\n` +
                `{{Cost|2}}`;

            const actual = extractTemplate(wikiText, 'Non existent Template');

            expect(actual).toBe('');
        });

        it('with existent template should return correct template', () => {
            const wikiText: WikiText =
                `{{Infobox Set\n` +
                `|othercards =* 5 {{Card|Hero|Heroes}}\n` +
                `}}\n\n` +
                `'''Adventures''' is...\n` +
                `{{Cost|2}}`;
            const expected: WikiText = `{{Infobox Set\n|othercards =* 5 {{Card|Hero|Heroes}}\n}}`;

            const actual = extractTemplate(wikiText, 'Infobox Set');

            expect(actual).toBe(expected);
        });
    });

    describe('extractTemplates', () => {
        it('with non-existent template should return empty array', () => {
            const wikiText: WikiText = `{{CardLangVersion|German| Dorf | '''+2&nbsp;Aktionen''' }}`;

            const actual = extractTemplates(wikiText, 'Non existent Template');

            expect(actual).toEqual([]);
        });

        it('with multiple templates should return all of them', () => {
            const wikiText: WikiText =
                `{{StartCardLangVersions}}\n` +
                `{{CardLangVersion|Czech| Vesnice | }}\n` +
                `{{CardLangVersion|German| Dorf | '''+1&nbsp;Karte''' | d=g }}\n` +
                `{{EndCardLangVersions}}`;
            const expected: WikiText[] = [
                `{{CardLangVersion|Czech| Vesnice | }}`,
                `{{CardLangVersion|German| Dorf | '''+1&nbsp;Karte''' | d=g }}`,
            ];

            const actual = extractTemplates(wikiText, 'CardLangVersion');

            expect(actual).toEqual(expected);
        });

        it('with nested template should return template with correct end', () => {
            const wikiText: WikiText =
                `{{CardLangVersion|French| Autel | Recevez jusqu'à {{Cost|5}}. }}\n` +
                `{{Navbox Dark Ages}}`;
            const expected: WikiText[] = [
                `{{CardLangVersion|French| Autel | Recevez jusqu'à {{Cost|5}}. }}`,
            ];

            const actual = extractTemplates(wikiText, 'CardLangVersion');

            expect(actual).toEqual(expected);
        });

        it('with template name being a prefix of another one should return only exact matches', () => {
            const wikiText: WikiText =
                `{{CardLangVersionImage|Polish}}\n` + `{{CardLangVersion|Polish| Wioska | }}`;
            const expected: WikiText[] = [`{{CardLangVersion|Polish| Wioska | }}`];

            const actual = extractTemplates(wikiText, 'CardLangVersion');

            expect(actual).toEqual(expected);
        });

        it('with unclosed template should return empty array', () => {
            const wikiText: WikiText = `{{CardLangVersion|German| Dorf `;

            const actual = extractTemplates(wikiText, 'CardLangVersion');

            expect(actual).toEqual([]);
        });
    });

    describe('extractTemplateArguments', () => {
        it('with positional and named arguments should return both separately', () => {
            const template: WikiText = `{{CardLangVersion|German|r=2| Altar | Entsorge. | (2019) | o=1 }}`;

            const actual = extractTemplateArguments(template);

            expect(actual.positional).toEqual(['German', ' Altar ', ' Entsorge. ', ' (2019) ']);
            expect(actual.named).toEqual(
                new Map([
                    ['r', '2'],
                    ['o', '1 '],
                ]),
            );
        });

        it('with named argument before positional ones should not shift their order', () => {
            const template: WikiText = `{{CardLangVersion|l=1|French| Convocation | Recevez. }}`;

            const actual = extractTemplateArguments(template);

            expect(actual.positional).toEqual(['French', ' Convocation ', ' Recevez. ']);
            expect(actual.named).toEqual(new Map([['l', '1']]));
        });

        it('with nested template containing arguments should keep them together', () => {
            const template: WikiText = `{{CardLangVersion|Czech| Chudobinec | {{Costplus|4}}<p>{{nowrap|–{{Cost|1}}}} za kartu. }}`;

            const actual = extractTemplateArguments(template);

            expect(actual.positional).toEqual([
                'Czech',
                ' Chudobinec ',
                ' {{Costplus|4}}<p>{{nowrap|–{{Cost|1}}}} za kartu. ',
            ]);
        });

        it('with wiki link containing a pipe should keep it together', () => {
            const template: WikiText = `{{CardLangVersion|German| Keller | Note: [[Way_of_the_Chameleon#Other|phrased as +Card.]] | d=s }}`;

            const actual = extractTemplateArguments(template);

            expect(actual.positional).toEqual([
                'German',
                ' Keller ',
                ' Note: [[Way_of_the_Chameleon#Other|phrased as +Card.]] ',
            ]);
            expect(actual.named).toEqual(new Map([['d', 's ']]));
        });

        it('with equals sign inside an argument value should treat it as positional', () => {
            const template: WikiText = `{{CardLangVersion|German| Dorf | 1 + 1 = 2 }}`;

            const actual = extractTemplateArguments(template);

            expect(actual.positional).toEqual(['German', ' Dorf ', ' 1 + 1 = 2 ']);
            expect(actual.named).toEqual(new Map());
        });

        it('with omitted argument should return it as empty string', () => {
            const template: WikiText = `{{CardLangVersion|Finnish| Kylä | }}`;

            const actual = extractTemplateArguments(template);

            expect(actual.positional).toEqual(['Finnish', ' Kylä ', ' ']);
        });
    });

    describe('extractTemplatePropertyValue', () => {
        it('with non-existent template property should return empty string', () => {
            const wikiText: WikiText = `{{Infobox Set\n|othercards=* 5 {{Card|Hero|Heroes}}\n|blankcards = 6\n}}`;

            const actual = extractTemplatePropertyValue(wikiText, 'nonexistentproperty');

            expect(actual).toBe('');
        });

        it('with template property in middle of template should return correct template property value', () => {
            const wikiText: WikiText = `{{Infobox Set\n|othercards=* 5 {{Card|Hero|Heroes}}\n|blankcards = 6\n}}`;
            const expected: WikiText = `* 5 {{Card|Hero|Heroes}}\n`;

            const actual = extractTemplatePropertyValue(wikiText, 'othercards');

            expect(actual).toBe(expected);
        });

        it('with template property at end of template should return correct template property value', () => {
            const wikiText: WikiText = `{{Infobox Set\n|othercards=* 5 {{Card|Hero|Heroes}}\n|blankcards = 6\n}}`;
            const expected: WikiText = ` 6\n`;

            const actual = extractTemplatePropertyValue(wikiText, 'blankcards');

            expect(actual).toBe(expected);
        });
    });

    describe('extractSection', () => {
        it('with non-existent section should return empty string', () => {
            const wikiText: WikiText = `== Contents ==\n`;

            const actual = extractSection(wikiText, 'Non existent Section', 2);

            expect(actual).toBe('');
        });

        it('with section at beginning or in middle should return correct section', () => {
            const wikiText: WikiText =
                `== Contents == \n` +
                `Any contents...\n` +
                `=== Kingdom cards ===\n` +
                `Any kingdom cards...\n` +
                ` ==Flavor text== \n`;
            const expected: WikiText =
                `== Contents == \n` +
                `Any contents...\n` +
                `=== Kingdom cards ===\n` +
                `Any kingdom cards...`;

            const actual = extractSection(wikiText, 'Contents', 2);

            expect(actual).toBe(expected);
        });

        it('with section at end should return correct section', () => {
            const wikiText: WikiText =
                `== Contents ==\n` +
                `Any contents...\n` +
                `== Flavor text ==\n` +
                `Any flavor text...`;
            const expected: WikiText = `== Flavor text ==\nAny flavor text...`;

            const actual = extractSection(wikiText, 'Flavor text', 2);

            expect(actual).toBe(expected);
        });
    });

    describe('normalize', () => {
        it('with undefined should return empty string', () => {
            const actual = normalize(undefined);

            expect(actual).toBe('');
        });

        it('with value should convert \\n to spaces and trim', () => {
            const actual = normalize(' any\ntext\n ');

            expect(actual).toBe('any text');
        });
    });
});
