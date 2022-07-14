import { ExpansionPage, WikiText } from '../wiki-client/api-models';
import { extractSection, normalize } from './helper-functions';

export class ExpansionCardsMapBuilder {
    build(expansionPage: ExpansionPage): Map<number, string[]> {
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
        const cardRegex = /{{\s*(?:Card|Event|Landmark|Boon|Hex|State|Artifact|Project|Way)\s*\|(.*?)}}(\*?)/g;
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
