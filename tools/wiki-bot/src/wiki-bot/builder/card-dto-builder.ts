import { CardTypePage } from './../wiki-client/api-models';
import { CardType } from './../../../../../src/app/models/card-type';
import { CardPage, WikiText } from '../wiki-client/api-models';
import { CardDto } from '../../../../../src/app/dtos/card-dto';
import {
    extractSection,
    extractTemplate,
    extractTemplatePropertyValue,
    normalize,
} from './helper-functions';

export class CardDtoBuilder {
    build(
        page: CardPage | CardTypePage,
        cardExpansionsMap: Map<string, number[]>,
        cardTypes: CardType[],
        redirectingCardPage?: CardPage,
    ): CardDto | null {
        const wikiText: WikiText = page.revisions[0]['*'] ?? '';
        const infoBox: WikiText = extractTemplate(wikiText, 'Infobox');

        if (infoBox === '') {
            return null;
        }

        const name = redirectingCardPage?.title ?? this.extractName(page, infoBox);

        return {
            id: redirectingCardPage?.pageid ?? page.pageid,
            name: name,
            description: this.extractDescription(infoBox),
            image: this.extractImage(name, wikiText),
            wikiUrl: redirectingCardPage?.fullurl ?? page.fullurl,
            expansions: this.extractExpansions(name, cardExpansionsMap),
            types: this.extractTypes(infoBox, cardTypes),
            isKingdomCard: this.extractIsKingdomCard(infoBox),
            cost: this.extractCost(infoBox),
            costModifier: this.extractCostModifier(infoBox),
            debt: this.extractDebt(infoBox),
        };
    }

    private extractName(page: CardPage | CardTypePage, infoBox: WikiText): string {
        return normalize(extractTemplatePropertyValue(infoBox, 'name')).replace(
            '{{PAGENAME}}',
            page.title,
        );
    }

    private extractDescription(infoBox: WikiText): string {
        const text: WikiText = normalize(
            extractTemplatePropertyValue(infoBox, 'text').replace(/<br\/>/g, '<br>'),
        );
        const text2: WikiText = normalize(
            extractTemplatePropertyValue(infoBox, 'text2').replace(/<br\/>/g, '<br>'),
        );

        return text2 ? `${text}{{divline}}${text2}` : text;
    }

    private extractImage(cardName: string, wikiText: WikiText): string {
        const trivia: WikiText = extractSection(wikiText, 'Trivia', 2);

        const officialArtRegExp = /{{\s*OfficialArt\s*\|?.*}}/;
        if (officialArtRegExp.test(trivia)) {
            return `${cardName.replace(/\s/g, '_')}Art.jpg`;
        }

        const cardArtRegExp = /\[\[\s*Image:(.*?\.jpg)\s*\|.*?\|\s*.*card.*art.*\]\]/;
        return normalize(cardArtRegExp.exec(trivia)?.[1])
            .replace('{{PAGENAME}}', cardName)
            .replace(/\s/g, '_');
    }

    private extractExpansions(
        cardName: string,
        cardExpansionsMap: Map<string, number[]>,
    ): number[] {
        return cardExpansionsMap.get(cardName) ?? [];
    }

    private extractTypes(infoBox: WikiText, cardTypes: CardType[]): number[] {
        const types: number[] = [];

        const templateName = normalize(/Infobox ([^|]*)/.exec(infoBox)?.[1]);
        const cardType = cardTypes.find((cardType: CardType) => cardType.name === templateName);
        if (cardType !== undefined) types.push(cardType.id);

        let index = 1;

        while (true) {
            const extractedTypeName = normalize(
                extractTemplatePropertyValue(infoBox, `type${index}`),
            );
            const cardType = cardTypes.find(
                (cardType: CardType) => cardType.name === extractedTypeName,
            );
            if (cardType === undefined) break;

            types.push(cardType.id);
            index++;
        }

        return types;
    }

    private extractIsKingdomCard(infoBox: WikiText): boolean {
        const infoBoxType = normalize(/Infobox\s([^|]*)/.exec(infoBox)?.[1] ?? '');

        if (infoBoxType !== 'Card') {
            return false;
        }

        const isKingdomCard: WikiText = normalize(
            extractTemplatePropertyValue(infoBox, 'kingdom'),
        ).toLowerCase();

        return isKingdomCard !== 'no';
    }

    private extractCost(infoBox: WikiText): number {
        const cost: WikiText = normalize(extractTemplatePropertyValue(infoBox, 'cost'));

        return Number(/\d+/.exec(cost)?.[0] ?? 0);
    }

    private extractCostModifier(infoBox: WikiText): string | undefined {
        const cost: WikiText = normalize(extractTemplatePropertyValue(infoBox, 'cost'));

        return /[^\d]/.exec(cost)?.[0];
    }

    private extractDebt(infoBox: WikiText): number | undefined {
        const cost2: WikiText = normalize(extractTemplatePropertyValue(infoBox, 'cost2'));

        return cost2 ? Number(cost2) : undefined;
    }
}
