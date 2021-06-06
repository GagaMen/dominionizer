import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { CardTranslation } from '../../../../../src/app/models/card';
import { CardPage, WikiText } from '../wiki-client/api-models';

export class CardTranslationBuilder {
    build(cardPage: CardPage, cardDto: CardDto): Map<string, CardTranslation> {
        const wikiText: WikiText = cardPage.revisions[0]['*'] ?? '';
        const otherLanguageVersions: WikiText =
            /===\s*Other language versions\s*===(.*?)==/.exec(wikiText)?.[1] ?? '';
        const table = /{\|(.*?)\|}/.exec(otherLanguageVersions)?.[1] ?? '';
        const rows = table
            .split('|-')
            .slice(1)
            .filter((row) => this.normalizeWikiText(row) !== '');

        return new Map<string, CardTranslation>(
            rows.map((row) => {
                const match = /!([^|]*)\|(.*)/.exec(row);
                const language = this.normalizeWikiText(match?.[1]);
                const columns = match?.[2].split('||');

                const cardName = this.normalizeWikiText(columns?.[0].match(/^[^(]*/)?.[0]);
                const cardDescription: string[] = this.extractCardDescription(
                    columns?.[3].trim(),
                    cardDto,
                );

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
        if (!description || !this.normalizeWikiText(description)) {
            return [];
        }

        if (cardDto.description.length == 1) {
            return [this.normalizeWikiText(description)];
        }

        description = description.replace(/\\n$/, '').replace(/<hr>|\\n/, '<br>');

        const breakCount = cardDto.description[0].split('<br>').length;
        const descriptionParts = description?.split('<br>');
        const text1 = descriptionParts?.slice(0, breakCount).join('<br>');
        const text2 = descriptionParts?.slice(breakCount).join('<br>');

        return [this.normalizeWikiText(text1), this.normalizeWikiText(text2)];
    }

    private normalizeWikiText(value: WikiText | undefined): string {
        return value?.replace('\\n', '').trim() ?? '';
    }
}
