import { CardPage, CardTypePage, WikiText } from './../wiki-client/api-models';
import { extractTemplates } from './../builder/helper-functions';
import { ValidationResult } from './validation-result';

// The wiki reshapes its language tables from time to time. Without this check a builder that no
// longer recognizes them drops the translations of a page without leaving a trace in the output.
export class TranslationPresenceValidator {
    readonly name: string = 'translation presence';

    validate(page: CardPage | CardTypePage, translationCount: number): ValidationResult {
        if (translationCount > 0 || !this.hasTranslationBlock(page)) {
            return ValidationResult.Success;
        }

        return ValidationResult.Failure(
            `Page "${page.title}" contains a block of translations, but none could be extracted from it.`,
        );
    }

    private hasTranslationBlock(page: CardPage | CardTypePage): boolean {
        const wikiText: WikiText = (page.revisions[0].slots.main['*'] ?? '').replace(
            /<!--.*?-->/gs,
            '',
        );

        return (
            extractTemplates(wikiText, 'CardLangVersion').length > 0 ||
            /={2,3}\s*(?:In other languages|Other language versions)\s*={2,3}/.test(wikiText)
        );
    }
}
