import { CardType } from '../../../../../src/app/models/card-type';
import { CardPage, WikiText } from '../wiki-client/api-models';
import { CardDto } from 'src/app/dtos/card-dto';

export class CardDtoBuilder {
    constructor(private expansionMap: Map<string, number[]>) {}

    build(cardPage: CardPage): CardDto {
        return {
            id: cardPage.pageid,
            name: cardPage.title,
            expansions: this.extractExpansions(cardPage),
            types: this.extractTypes(cardPage),
            isKingdomCard: this.extractIsKingdomCard(cardPage),
            cost: this.extractCost(cardPage),
        };
    }

    private extractExpansions(cardPage: CardPage): number[] {
        return this.expansionMap.get(cardPage.title) ?? [];
    }

    private extractTypes(cardPage: CardPage): number[] {
        const wikiText: WikiText = cardPage.revisions[0]['*'] ?? '';
        const infoBox: WikiText = /\{\{Infobox Card\\n.*\}\}/g.exec(wikiText)?.[0] ?? '';

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

    private extractIsKingdomCard(cardPage: CardPage): boolean {
        const wikiText: WikiText = cardPage.revisions[0]['*'] ?? '';
        const infoBox: WikiText = /\{\{Infobox Card\\n.*\}\}/.exec(wikiText)?.[0] ?? '';
        const isKingdomCard: WikiText = /\|kingdom.*\\n/.exec(infoBox)?.[0] ?? '';

        return !/= No/.test(isKingdomCard);
    }

    private extractCost(cardPage: CardPage): number {
        const wikiText: WikiText = cardPage.revisions[0]['*'] ?? '';
        const infoBox: WikiText = /\{\{Infobox Card\\n.*\}\}/.exec(wikiText)?.[0] ?? '';
        const cost: WikiText = /\|cost.*\\n/.exec(infoBox)?.[0] ?? '';

        return Number(/\d+/.exec(cost)?.[0] ?? 0);
    }
}
