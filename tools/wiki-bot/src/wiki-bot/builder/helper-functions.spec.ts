import { WikiText } from '../wiki-client/api-models';
import {
    extractSection,
    extractTemplate,
    extractTemplatePropertyValue,
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
                `== Contents ==\n` +
                `Any contents...\n` +
                `=== Kingdom cards ===\n` +
                `Any kingdom cards...\n` +
                `== Flavor text ==\n`;
            const expected: WikiText =
                `== Contents ==\n` +
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
