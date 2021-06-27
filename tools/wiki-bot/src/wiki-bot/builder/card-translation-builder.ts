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
        const table = /{\|(.*?)\|}/.exec(otherLanguageVersions)?.[1] ?? '';
        const rows = table
            .split('|-')
            .slice(1)
            .filter((row) => normalize(row) !== '');

        return new Map<string, CardTranslation>(
            rows.map((row) => {
                const match = /!([^|]*)\|(.*)/.exec(row);
                const language = normalize(match?.[1]);
                const columns = match?.[2].split('||');

                const cardName = normalize(columns?.[0].match(/^[^(]*/)?.[0]);
                const cardDescription = this.extractCardDescription(columns?.[3], cardDto);

                return [
                    language,
                    {
                        id: cardPage.pageid,
                        name: cardName,
                        description: cardDescription,
                    },
                ];
            }),
        );
    }

    private extractCardDescription(description: WikiText | undefined, cardDto: CardDto): string[] {
        if (!description || !normalize(description)) {
            return [];
        }

        if (cardDto.description.length == 1) {
            return [normalize(description)];
        }

        description = description.replace(/\\n$/, '').replace(/<hr>|\\n/g, '<br>');

        const breakCount = cardDto.description[0].split('<br>').length;
        const descriptionParts = description?.split('<br>');
        const text1 = descriptionParts?.slice(0, breakCount).join('<br>');
        const text2 = descriptionParts?.slice(breakCount).join('<br>');

        return [normalize(text1), normalize(text2)];
    }
}
