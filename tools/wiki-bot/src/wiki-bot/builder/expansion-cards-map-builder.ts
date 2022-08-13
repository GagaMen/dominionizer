import { CardTypePage } from './../wiki-client/api-models';
import { ExpansionPage, WikiText } from '../wiki-client/api-models';
import {
    extractSection,
    extractTemplate,
    extractTemplatePropertyValue,
    normalize,
} from './helper-functions';

export class ExpansionCardsMapBuilder {
    buildWithExpansionPage(expansionPage: ExpansionPage): Map<number, string[]> {
        const wikiText: WikiText = expansionPage.revisions[0]['*'] ?? '';
        let contents: WikiText = extractSection(wikiText, 'Contents', 2);
        const expansionCardsMap = new Map<number, string[]>();

        const removedCards: WikiText = extractSection(
            contents,
            'Removed first-edition Kingdom cards',
            3,
        );

        contents = contents.replace(removedCards, '');
        this.updateMapForSection(expansionCardsMap, expansionPage.pageid, contents);

        if (expansionCardsMap.size > 1) {
            this.addCardsFromFirstToSecondEdition(expansionCardsMap, expansionPage);
        }

        this.updateMapForSection(expansionCardsMap, expansionPage.pageid, removedCards);

        // special implementation for promo cards because of different page structure
        const promoCards = extractSection(wikiText, 'Card List', 2);
        this.updateMapForSection(expansionCardsMap, expansionPage.pageid, promoCards);

        return expansionCardsMap;
    }

    buildWithCardTypePage(
        cardTypePage: CardTypePage,
        expansionCardsMap: Map<number, string[]>,
    ): Map<number, string[]> {
        const wikiText: WikiText = cardTypePage.revisions[0]['*'] ?? '';
        const infoBox: WikiText = extractTemplate(wikiText, 'Infobox Card');
        const expansionCardsMapForCardType = new Map<number, string[]>();

        if (infoBox === '') {
            return expansionCardsMapForCardType;
        }

        const cardTypeName = normalize(extractTemplatePropertyValue(infoBox, 'name'));
        let cardTypeExpansion: number | undefined = undefined;
        for (const [expansion, cardNames] of expansionCardsMap) {
            if (!cardNames.includes(cardTypeName)) {
                continue;
            }

            cardTypeExpansion = expansion;
        }

        if (cardTypeExpansion === undefined) {
            return expansionCardsMapForCardType;
        }

        expansionCardsMapForCardType.set(cardTypeExpansion, [cardTypeName]);

        const cardList: WikiText = extractSection(wikiText, 'List of.*?', 2);
        this.updateMapForSection(expansionCardsMapForCardType, cardTypeExpansion, cardList);

        return expansionCardsMapForCardType;
    }

    private addCardsFromFirstToSecondEdition(
        expansionCardsMap: Map<number, string[]>,
        expansionPage: ExpansionPage,
    ) {
        const cardsOfFirstEdition = expansionCardsMap.get(expansionPage.pageid) ?? [];
        const cardsOfSecondEdition = expansionCardsMap.get(expansionPage.pageid + 0.1) ?? [];

        expansionCardsMap.set(
            expansionPage.pageid + 0.1,
            cardsOfSecondEdition.concat(cardsOfFirstEdition),
        );
    }

    private updateMapForSection(
        expansionCardsMap: Map<number, string[]>,
        expansionId: number,
        section: WikiText,
    ): void {
        const cardRegex = /{{\s*(?:Card|Event|Landmark|Boon|Hex|State|Artifact|Project|Way|Ally)\s*\|(.*?)}}(\*?)/g;
        let match: RegExpExecArray | null;
        while ((match = cardRegex.exec(section))) {
            const card = normalize(match?.[1]);
            const expansionEditionId = match?.[2] === '*' ? expansionId + 0.1 : expansionId;

            if (!expansionCardsMap.has(expansionEditionId)) {
                expansionCardsMap.set(expansionEditionId, []);
            }

            const cards = expansionCardsMap.get(expansionEditionId);
            if (cards?.includes(card)) {
                continue;
            }

            cards?.push(card);
        }
    }
}
