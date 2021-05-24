import { CardType } from '../../../../../src/app/models/card-type';
import { CardPage, WikiText } from '../wiki-client/api-models';
import { CardDto } from '../../../../../src/app/dtos/card-dto';

export class CardDtoBuilder {
    constructor(private cardExpansionsMap: Map<string, number[]>) {}

    build(cardPage: CardPage): CardDto {
        const wikiText: WikiText = cardPage.revisions[0]['*'] ?? '';
        const infoBox: WikiText = /\{\{Infobox Card\\n.*?\}\}\\n\\n/g.exec(wikiText)?.[0] ?? '';

        return {
            id: cardPage.pageid,
            name: cardPage.title,
            description: this.extractDescription(infoBox),
            image: this.extractImage(wikiText),
            wikiUrl: cardPage.fullurl,
            expansions: this.extractExpansions(cardPage),
            types: this.extractTypes(infoBox),
            isKingdomCard: this.extractIsKingdomCard(infoBox),
            cost: this.extractCost(infoBox),
            potion: this.extractPotion(infoBox),
            debt: this.extractDebt(infoBox),
        };
    }

    private extractDescription(infoBox: WikiText): string[] {
        const text: WikiText = /\|text = (.*?)\\n/.exec(infoBox)?.[1] ?? '';
        const text2: WikiText = /\|text2 = (.*?)\\n/.exec(infoBox)?.[1] ?? '';

        return text2 ? [text, text2] : [text];
    }

    private extractImage(wikiText: WikiText): string {
        const trivia: WikiText = /== Trivia ==[^=]*/.exec(wikiText)?.[0] ?? '';

        return /\[\[Image:(.*?\.jpg)\|.*?\|Official card art\.\]\]/.exec(trivia)?.[1] ?? '';
    }

    private extractExpansions(cardPage: CardPage): number[] {
        return this.cardExpansionsMap.get(cardPage.title) ?? [];
    }

    private extractTypes(infoBox: WikiText): number[] {
        const typeNames: string[] = Object.keys(CardType).filter(
            (typeName: string) => !(parseInt(typeName) >= 0),
        );
        const types: number[] = [];

        const regex = /\|type\d = (\w*)/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(infoBox))) {
            const type = typeNames.findIndex((typeName: string) => typeName === match?.[1]) + 1;
            types.push(type);
        }

        return types;
    }

    private extractIsKingdomCard(infoBox: WikiText): boolean {
        const isKingdomCard: WikiText = /\|kingdom.*?\\n/.exec(infoBox)?.[0] ?? '';

        return !/= No/.test(isKingdomCard);
    }

    private extractCost(infoBox: WikiText): number {
        const cost: WikiText = /\|cost =.*?\\n/.exec(infoBox)?.[0] ?? '';

        return Number(/\d+/.exec(cost)?.[0] ?? 0);
    }

    private extractPotion(infoBox: WikiText): boolean | undefined {
        const cost: WikiText = /\|cost =.*?\\n/.exec(infoBox)?.[0] ?? '';

        return /P/.test(cost) ? true : undefined;
    }

    private extractDebt(infoBox: WikiText): number | undefined {
        const cost2: WikiText = /\|cost2 =.*?\\n/.exec(infoBox)?.[0] ?? '';

        return cost2 ? Number(/= (\d+)/.exec(cost2)?.[1]) : undefined;
    }
}
