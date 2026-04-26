import {
    CardTypeTranslation,
    CardTypeTranslationV2,
} from './../../../../../src/app/models/card-type';
import { CardTypePage, CargoCardType, WikiText } from '../wiki-client/api-models';
import { extractSection, normalize } from './helper-functions';
import { CardTranslationBuilder } from './card-translation-builder';

export class CardTypeTranslationBuilder {
    constructor(private cardTranslationBuilder: CardTranslationBuilder) {}

    build(_page: CardTypePage): Map<string, CardTypeTranslation> {
        return new Map();
    }

    buildFromCargo(
        cardTypePage: CardTypePage,
        cargoCardType: CargoCardType,
    ): Map<string, CardTypeTranslationV2> {
        const wikiText: WikiText = cardTypePage.revisions[0]['*'] ?? '';
        let translationSection: WikiText = extractSection(
            wikiText,
            '(?:In other languages|Other language versions)',
            3,
        );

        if (this.hasTableForm(translationSection)) {
            const cardTranslations = this.cardTranslationBuilder.buildFromCargo(
                cardTypePage,
                cargoCardType,
            );
            const cardTypeTranslations = new Map<string, CardTypeTranslationV2>();

            for (const [language, translation] of cardTranslations) {
                cardTypeTranslations.set(language, { id: translation.id, name: translation.name });
            }

            return cardTypeTranslations;
        }

        translationSection = translationSection.replace(/<!--.*?-->/gs, '');

        const languageCandidates: WikiText[] = translationSection.split(/\n\*\s/).slice(1);
        return new Map<string, CardTypeTranslationV2>(
            languageCandidates.map((languageCandidate: WikiText) => {
                const language = /^[^:]*/.exec(languageCandidate)?.[0];
                let name: string | undefined =
                    languageCandidate.split(/\n\*\*/)[1] ??
                    /^[^:]*:(.*)/.exec(languageCandidate)?.[1] ??
                    '';
                name = /[^(:]*/.exec(name)?.[0];

                return [normalize(language), { id: cargoCardType.Id, name: normalize(name) }];
            }),
        );
    }

    private hasTableForm(translationSection: WikiText) {
        return /\n\s*{\|.*?\n\s*\|}/s.test(translationSection);
    }
}
