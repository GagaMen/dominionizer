import { ExpansionTranslation } from '../../../../../src/app/models/expansion';
import { ExpansionPage, WikiText } from '../wiki-client/api-models';

export class ExpansionTranslationBuilder {
    build(expansionPage: ExpansionPage): Map<string, ExpansionTranslation> {
        const wikiText: WikiText = expansionPage.revisions[0]['*'] ?? '';
        const inOtherLanguages: WikiText =
            /=== In other languages ===\\n\* ([^=]*)/.exec(wikiText)?.[1] ?? '';
        const languages: WikiText[] = inOtherLanguages.split(/\\n\* /);

        return new Map<string, ExpansionTranslation>(
            languages.map((language: WikiText) => {
                const extractedLanguage: string = /^\w*/.exec(language)?.[0] ?? '';
                const name: WikiText =
                    language.split(/\\n\*\* /)[1] ?? /^\w*: (.*)/.exec(language)?.[1] ?? '';
                const extractedName: string = /[^(:]*/.exec(name)?.[0].trim() ?? '';

                return [extractedLanguage, { id: expansionPage.pageid, name: extractedName }];
            }),
        );
    }
}
