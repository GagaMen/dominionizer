import { CardType } from '../../../../../src/app/models/card-type';
import { CardPage, WikiText } from '../wiki-client/api-models';
import { CardDto } from '../../../../../src/app/dtos/card-dto';
import {
    extractSection,
    extractTemplate,
    extractTemplatePropertyValue,
    normalize,
} from './helper-functions';

export class CardDtoBuilder {
    build(cardPage: CardPage, cardExpansionsMap: Map<string, number[]>): CardDto {
        const wikiText: WikiText = cardPage.revisions[0]['*'] ?? '';
        const infoBox: WikiText = extractTemplate(wikiText, 'Infobox Card');

        return {
            id: cardPage.pageid,
            name: cardPage.title,
            description: this.extractDescription(infoBox),
            image: this.extractImage(wikiText),
            wikiUrl: cardPage.fullurl,
            expansions: this.extractExpansions(cardPage, cardExpansionsMap),
            types: this.extractTypes(infoBox),
            isKingdomCard: this.extractIsKingdomCard(infoBox),
            cost: this.extractCost(infoBox),
            potion: this.extractPotion(infoBox),
            debt: this.extractDebt(infoBox),
        };
    }

    private extractDescription(infoBox: WikiText): string[] {
        const text: WikiText = normalize(extractTemplatePropertyValue(infoBox, 'text'));
        const text2: WikiText = normalize(extractTemplatePropertyValue(infoBox, 'text2'));

        return text2 ? [text, text2] : [text];
    }

    private extractImage(wikiText: WikiText): string {
        const trivia: WikiText = extractSection(wikiText, 'Trivia', 2);

        return normalize(
            /\[\[\s*Image:(.*?\.jpg)\s*\|.*?\|\s*Official card art\.\s*\]\]/.exec(trivia)?.[1],
        );
    }

    private extractExpansions(
        cardPage: CardPage,
        cardExpansionsMap: Map<string, number[]>,
    ): number[] {
        return cardExpansionsMap.get(cardPage.title) ?? [];
    }

    private extractTypes(infoBox: WikiText): number[] {
        const typeNames: string[] = Object.keys(CardType).filter(
            (typeName: string) => !(parseInt(typeName) >= 0),
        );

        const types: number[] = [];
        let index = 1;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const extractedTypeName = normalize(
                extractTemplatePropertyValue(infoBox, `type${index}`),
            );
            const type =
                typeNames.findIndex((typeName: string) => typeName === extractedTypeName) + 1;
            if (type <= 0) break;

            types.push(type);
            index++;
        }

        return types;
    }

    private extractIsKingdomCard(infoBox: WikiText): boolean {
        const isKingdomCard: WikiText = normalize(extractTemplatePropertyValue(infoBox, 'kingdom'));

        return isKingdomCard !== 'No';
    }

    private extractCost(infoBox: WikiText): number {
        const cost: WikiText = normalize(extractTemplatePropertyValue(infoBox, 'cost'));

        return Number(cost.replace(/P/, '')) ?? 0;
    }

    private extractPotion(infoBox: WikiText): boolean | undefined {
        const cost: WikiText = normalize(extractTemplatePropertyValue(infoBox, 'cost'));

        return /P/.test(cost) ? true : undefined;
    }

    private extractDebt(infoBox: WikiText): number | undefined {
        const cost2: WikiText = normalize(extractTemplatePropertyValue(infoBox, 'cost2'));

        return cost2 ? Number(cost2) : undefined;
    }
}
