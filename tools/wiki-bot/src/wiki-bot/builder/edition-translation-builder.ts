import { EditionTranslation } from '../../../../../src/app/models/edition';
import { CargoEdition, ExpansionPage, WikiText } from '../wiki-client/api-models';
import { extractSection, normalize } from './helper-functions';

export class EditionTranslationBuilder {
    build(
        expansionPage: ExpansionPage,
        editions: CargoEdition[],
    ): Map<string, EditionTranslation[]> {
        const wikiText: WikiText = expansionPage.revisions[0].slots.main['*'] ?? '';
        let inOtherLanguages: WikiText = extractSection(
            wikiText,
            'Official releases in other languages',
            3,
        );
        inOtherLanguages = inOtherLanguages.replace(/<!--.*?-->/gs, '');
        const languageCandidates: WikiText[] = inOtherLanguages.split(/\n\*\s/).slice(1);

        return new Map<string, EditionTranslation[]>(
            languageCandidates.map((languageCandidate: WikiText) => {
                const listItems = languageCandidate.split(/\n\*\*/);
                const language = /^[^:(]*/.exec(listItems[0])?.[0];
                const expansion =
                    /:\s*(\S[^(:]*)/.exec(listItems[0])?.[1] ?? /^[^:(]+/.exec(listItems[1])?.[0];

                const translations: EditionTranslation[] = editions.map((edition) => ({
                    id: edition.Id,
                    expansion: normalize(expansion),
                }));

                return [normalize(language), translations];
            }),
        );
    }
}
