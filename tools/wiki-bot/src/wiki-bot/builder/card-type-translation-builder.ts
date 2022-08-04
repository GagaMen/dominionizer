import { CardTypeTranslation } from './../../../../../src/app/models/card-type';
import { CardTypePage, WikiText } from '../wiki-client/api-models';
import { extractSection, normalize } from './helper-functions';

export class CardTypeTranslationBuilder {
    build(cardTypePage: CardTypePage): Map<string, CardTypeTranslation> {
        const wikiText: WikiText = cardTypePage.revisions[0]['*'] ?? '';
        const inOtherLanguages: WikiText = extractSection(wikiText, 'In other languages', 3);

        if (inOtherLanguages !== '') {
            const languageCandidates: WikiText[] = inOtherLanguages.split(/\n\*\s/).slice(1);
            return new Map<string, CardTypeTranslation>(
                languageCandidates.map((languageCandidate: WikiText) => {
                    const language = /^[^:]*/.exec(languageCandidate)?.[0];
                    let name: string | undefined =
                        languageCandidate.split(/\n\*\*/)[1] ??
                        /^[^:]*:(.*)/.exec(languageCandidate)?.[1] ??
                        '';
                    name = /[^(:]*/.exec(name)?.[0];

                    return [
                        normalize(language),
                        { id: cardTypePage.pageid, name: normalize(name) },
                    ];
                }),
            );
        }

        const otherLanguageVersions: WikiText = extractSection(
            wikiText,
            'Other language versions',
            3,
        );
        const table = /{\|(.*?)\|}/s.exec(otherLanguageVersions)?.[1] ?? '';
        const rows = table
            .split('|-')
            .slice(1)
            .filter((row) => normalize(row) !== '');

        return new Map<string, CardTypeTranslation>(
            rows.map((row) => {
                const match = /!([^|]*)\|(.*)/s.exec(row);
                const language = normalize(match?.[1]);
                const columns = match?.[2].split('||');

                const cardTypeName = normalize(columns?.[0].match(/^[^(]*/)?.[0]);

                return [
                    language,
                    {
                        id: cardTypePage.pageid,
                        name: cardTypeName,
                    },
                ];
            }),
        );
    }
}
