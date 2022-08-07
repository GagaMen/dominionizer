import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { CardTranslation } from '../../../../../src/app/models/card';
import { CardPage, WikiText } from '../wiki-client/api-models';
import { extractSection, normalize } from './helper-functions';

export class CardTranslationBuilder {
    build(cardPage: CardPage, cardDto: CardDto): Map<string, CardTranslation> {
        const wikiText: WikiText = cardPage.revisions[0]['*'] ?? '';
        const otherLanguageVersions: WikiText = extractSection(
            wikiText,
            'Other language versions',
            3,
        );
        let table = /{\|(.*?)\|}/s.exec(otherLanguageVersions)?.[1] ?? '';
        // remove table header
        table = table.substr(table.indexOf('|-'));

        const translations: Map<string, CardTranslation> = new Map();

        const rowRegex = /![^|]*[^!]*/g;
        let languageVersion: RegExpExecArray | null;
        while ((languageVersion = rowRegex.exec(table))) {
            const match = /!(rowspan=\d\|)?([^|\\]*)/.exec(languageVersion[0]);
            const language = normalize(match?.[2]);

            // use last row of language, because this is the most up to date one
            const version = languageVersion[0]
                .split('|-\n')
                .filter((entry) => entry !== '')
                .pop();
            const columns = version?.split('||');

            const cardName = normalize(
                /^[^|]*\|([^(]*)/.exec(columns?.[0] as string)?.[1].replace('<br>', ''),
            );
            const cardDescription = this.extractCardDescription(columns?.[3], cardDto);

            translations.set(language, {
                id: cardPage.pageid,
                name: cardName,
                description: cardDescription,
            });
        }

        return translations;
    }

    private extractCardDescription(description: WikiText | undefined, cardDto: CardDto): string[] {
        if (!description || !normalize(description)) {
            return [];
        }

        if (cardDto.description.length == 1) {
            return [normalize(description)];
        }

        description = description.replace(/\n$/, '').replace(/<hr>|\n/g, '<br>');

        const breakCount = cardDto.description[0].split('<br>').length;
        const descriptionParts = description?.split('<br>');
        const text1 = descriptionParts?.slice(0, breakCount).join('<br>');
        const text2 = descriptionParts?.slice(breakCount).join('<br>');

        return [normalize(text1), normalize(text2)];
    }
}
