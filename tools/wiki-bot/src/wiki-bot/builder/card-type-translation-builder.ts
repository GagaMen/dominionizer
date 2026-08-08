import { CardTypeTranslation } from './../../../../../src/app/models/card-type';
import { CardTypePage, CargoCardType, WikiText } from '../wiki-client/api-models';
import { extractSection, extractTemplates, normalize } from './helper-functions';
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

        if (this.hasLangVersions(wikiText) || this.hasTableForm(translationSection)) {
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

    // Card type pages carry their translations either as a plain list, as a wikitable or - since
    // the wiki started migrating its language tables - as {{CardLangVersion}} template calls. The
    // latter two are shaped exactly like the ones on card pages, so the card translations are
    // reused and reduced to the fields of a card type translation.
    private hasLangVersions(wikiText: WikiText) {
        return extractTemplates(wikiText.replace(/<!--.*?-->/gs, ''), 'CardLangVersion').length > 0;
    }

    private hasTableForm(translationSection: WikiText) {
        return /\n\s*{\|.*?\n\s*\|}/s.test(translationSection);
    }
}
