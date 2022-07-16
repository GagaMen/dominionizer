import { CardTypeTranslation } from './../../../../../src/app/models/card-type';
import { CardTypePage, WikiText } from '../wiki-client/api-models';
import { extractSection, normalize } from './helper-functions';

export class CardTypeTranslationBuilder {
    build(cardTypePage: CardTypePage): Map<string, CardTypeTranslation> {
        const wikiText: WikiText = cardTypePage.revisions[0]['*'] ?? '';
        const inOtherLanguages: WikiText = extractSection(wikiText, 'In other languages', 3);
        const languageCandidates: WikiText[] = inOtherLanguages.split(/\n\*\s/).slice(1);

        return new Map<string, CardTypeTranslation>(
            languageCandidates.map((languageCandidate: WikiText) => {
                const language = /^[^:]*/.exec(languageCandidate)?.[0];
                let name: string | undefined =
                    languageCandidate.split(/\n\*\*/)[1] ??
                    /^[^:]*:(.*)/.exec(languageCandidate)?.[1] ??
                    '';
                name = /[^(:]*/.exec(name)?.[0];

                return [normalize(language), { id: cardTypePage.pageid, name: normalize(name) }];
            }),
        );
    }
}
