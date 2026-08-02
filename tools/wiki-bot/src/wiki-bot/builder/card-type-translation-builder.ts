import { CardTypeTranslation } from './../../../../../src/app/models/card-type';
import { CardTypePage, CargoCardType, WikiText } from '../wiki-client/api-models';
import { extractSection, normalize } from './helper-functions';
import { CardTranslationBuilder } from './card-translation-builder';
import { buildCargoId } from './cargo-id';

export class CardTypeTranslationBuilder {
    constructor(private cardTranslationBuilder: CardTranslationBuilder) {}

    build(
        cardTypePage: CardTypePage,
        cargoCardType: CargoCardType,
    ): Map<string, CardTypeTranslation> {
        const wikiText: WikiText = cardTypePage.revisions[0].slots.main['*'] ?? '';
        let translationSection: WikiText = extractSection(
            wikiText,
            '(?:In other languages|Other language versions)',
            3,
        );

        if (this.hasTableForm(translationSection)) {
            const cardTranslations = this.cardTranslationBuilder.build(cardTypePage, cargoCardType);
            const cardTypeTranslations = new Map<string, CardTypeTranslation>();

            for (const [language, translation] of cardTranslations) {
                cardTypeTranslations.set(language, { id: translation.id, name: translation.name });
            }

            return cardTypeTranslations;
        }

        translationSection = translationSection.replace(/<!--.*?-->/gs, '');

        const languageCandidates: WikiText[] = translationSection.split(/\n\*\s/).slice(1);
        return new Map<string, CardTypeTranslation>(
            languageCandidates.map((languageCandidate: WikiText) => {
                const language = /^[^:]*/.exec(languageCandidate)?.[0];
                let name: string | undefined =
                    languageCandidate.split(/\n\*\*/)[1] ??
                    /^[^:]*:(.*)/.exec(languageCandidate)?.[1] ??
                    '';
                name = /[^(:]*/.exec(name)?.[0];
                name = name?.replace(/(<br\s*\/?>|<hr[^>]*?>).*/, '');

                return [
                    normalize(language),
                    { id: buildCargoId(cargoCardType), name: normalize(name) },
                ];
            }),
        );
    }

    private hasTableForm(translationSection: WikiText) {
        return /\n\s*{\|.*?\n\s*\|}/s.test(translationSection);
    }
}
