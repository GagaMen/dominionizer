import { CardPage } from '../wiki-client/api-models';
import { TranslationPresenceValidator } from './translation-presence-validator';
import { ValidationResult } from './validation-result';

describe('TranslationPresenceValidator', () => {
    const validator = new TranslationPresenceValidator();

    const cardPage = (title: string, wikiText: string): CardPage =>
        ({
            pageid: 20,
            title,
            fullurl: '',
            revisions: [{ slots: { main: { '*': wikiText } } }],
        }) as CardPage;

    describe('validate', () => {
        it('with translations extracted from a template block should return Success', () => {
            const page = cardPage('Village', `{{CardLangVersion|German| Dorf | }}`);

            const actual = validator.validate(page, 17);

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with page without any translations should return Success', () => {
            const page = cardPage('Harem', `#REDIRECT [[Farm]]`);

            const actual = validator.validate(page, 0);

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with commented out template block should return Success', () => {
            const page = cardPage('Village', `<!--{{CardLangVersion|German| Dorf | }}-->`);

            const actual = validator.validate(page, 0);

            expect(actual).toEqual(ValidationResult.Success);
        });

        it('with unread template block should return Failure naming the page', () => {
            const page = cardPage(
                'Village',
                `{{StartCardLangVersions}}\n{{CardLangVersion|German| Dorf | }}\n`,
            );
            const expected = ValidationResult.Failure(
                'Page "Village" contains a block of translations, but none could be extracted from it.',
            );

            const actual = validator.validate(page, 0);

            expect(actual).toEqual(expected);
        });

        it('with unread section should return Failure naming the page', () => {
            const page = cardPage(
                'Border Village',
                `===Other language versions===\n{| class="wikitable"\n|}\n`,
            );
            const expected = ValidationResult.Failure(
                'Page "Border Village" contains a block of translations, but none could be extracted from it.',
            );

            const actual = validator.validate(page, 0);

            expect(actual).toEqual(expected);
        });
    });
});
