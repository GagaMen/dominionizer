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
    ): CardDto | null {
        const wikiText: WikiText = page.revisions[0]['*'] ?? '';
        const infoBox: WikiText = extractTemplate(wikiText, 'Infobox Card');

        if (infoBox === '') {
            return null;
        }

        const cardName: WikiText = normalize(extractTemplatePropertyValue(infoBox, 'name'));

        return {
            id: page.pageid,
            name: cardName,
            description: this.extractDescription(infoBox),
            image: this.extractImage(page, wikiText),
            wikiUrl: page.fullurl,
            expansions: this.extractExpansions(cardName, cardExpansionsMap),
            types: this.extractTypes(infoBox, cardTypes),
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

    private extractImage(cardPage: CardPage | CardTypePage, wikiText: WikiText): string {
        const trivia: WikiText = extractSection(wikiText, 'Trivia', 2);

        const officialArtRegExp = /{{\s*OfficialArt\s*\|?.*}}/;
        if (officialArtRegExp.test(trivia)) {
            return `${cardPage.title.replace(/\s/g, '_')}Art.jpg`;
        }

        const cardArtRegExp = /\[\[\s*Image:(.*?\.jpg)\s*\|.*?\|\s*Official (randomizer\s)?card art.*\]\]/;
        return normalize(cardArtRegExp.exec(trivia)?.[1]).replace(/\s/g, '_');
    }

    private extractExpansions(
        cardName: WikiText,
        cardExpansionsMap: Map<string, number[]>,
    ): number[] {
        return cardExpansionsMap.get(cardName) ?? [];
    }

    private extractTypes(infoBox: WikiText, cardTypes: CardType[]): number[] {
        const types: number[] = [];
        let index = 1;
        // eslint-disable-next-line no-constant-condition
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
