import { ExpansionTranslation } from '../../../../../src/app/models/expansion';
import { ExpansionPage, WikiText } from '../wiki-client/api-models';
import { extractSection, normalize } from './helper-functions';

export class ExpansionTranslationBuilder {
    build(expansionPage: ExpansionPage): Map<string, ExpansionTranslation> {
        const wikiText: WikiText = expansionPage.revisions[0]['*'] ?? '';
        const inOtherLanguages: WikiText = extractSection(wikiText, 'In other languages', 3);
        const languageCandidates: WikiText[] = inOtherLanguages.split(/\n\*\s/).slice(1);

        return new Map<string, ExpansionTranslation>(
            languageCandidates.map((languageCandidate: WikiText) => {
                const listItems = languageCandidate.split(/\n\*\*/);
                const language = /^[^:(]*/.exec(listItems[0])?.[0];
                const name =
                    /:\s*(\S[^(:]*)/.exec(listItems[0])?.[1] ?? /^[^:(]+/.exec(listItems[1])?.[0];

                return [normalize(language), { id: expansionPage.pageid, name: normalize(name) }];
            }),
        );
    }
}
