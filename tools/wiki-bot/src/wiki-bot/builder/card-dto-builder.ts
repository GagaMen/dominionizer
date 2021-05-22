import { Expansion } from './../../../../../src/app/models/expansion';
import { CardType } from '../../../../../src/app/models/card-type';
import { Card } from '../../../../../src/app/models/card';
import { CardPage, WikiText } from './../wiki-client/api-models';

export class CardDtoBuilder {
    constructor(private expansionMap: Map<string, Expansion[]>) {}

    build(cardPage: CardPage): Card {
        return {
            id: cardPage.pageid,
            name: cardPage.title,
            expansions: this.extractExpansions(cardPage),
            types: this.extractTypes(cardPage),
            isKingdomCard: this.extractIsKingdomCard(cardPage),
            cost: this.extractCost(cardPage),
        };
    }

    private extractExpansions(cardPage: CardPage): Expansion[] {
        return this.expansionMap.get(cardPage.title) ?? [];
    }

    private extractTypes(cardPage: CardPage): CardType[] {
        const wikiText: WikiText = cardPage.revisions[0]['*'] ?? '';
        const infoBox: WikiText = /\{\{Infobox Card\\n.*\}\}/g.exec(wikiText)?.[0] ?? '';

        const cardTypes: string[] = Object.keys(CardType).filter((x) => !(parseInt(x) >= 0));
        const types: CardType[] = [];

        const regex = /\|type\d = (\w*)/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(infoBox))) {
            const key = cardTypes.findIndex((x) => x === match?.[1]) + 1;
            types.push(key);
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
