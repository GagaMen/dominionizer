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
                const language = /^[^:(]*/.exec(languageCandidate)?.[0];
                let name: string | undefined =
                    languageCandidate.split(/\n\*\*/)[1] ??
                    /^[^:]*:(.*)/.exec(languageCandidate)?.[1] ??
                    '';
                name = /[^(:]*/.exec(name)?.[0];

                return [normalize(language), { id: expansionPage.pageid, name: normalize(name) }];
            }),
        );
    }
}
