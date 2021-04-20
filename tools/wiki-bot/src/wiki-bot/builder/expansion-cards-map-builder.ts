import { ExpansionPage, WikiText } from '../wiki-client/api-models';

export class ExpansionCardsMapBuilder {
    build(expansionPage: ExpansionPage): Map<number, string[]> {
        const wikiText: WikiText = expansionPage.revisions[0]['*'] ?? '';
        const contents: WikiText = /== Contents ==.*?\\n==(\s|[a-zA-Z])/.exec(wikiText)?.[0] ?? '';
        const expansionCardsMap = new Map<number, string[]>();

        [
            /=== Kingdom cards.*? ===[^=]*/.exec(contents)?.[0] ?? '',
            /=== Prizes ===[^=]*/.exec(contents)?.[0] ?? '',
            /==== Ruins ====[^=]*/.exec(contents)?.[0] ?? '',
            /==== Shelters ====[^=]*/.exec(contents)?.[0] ?? '',
            /==== Non-Supply cards ====[^=]*/.exec(contents)?.[0] ?? '',
            /=== Events ===[^=]*/.exec(contents)?.[0] ?? '',
            /==== Upgrade cards ====[^=]*/.exec(contents)?.[0] ?? '',
            /=== Landmarks ===[^=]*/.exec(contents)?.[0] ?? '',
            /==== \[\[Boon\]\]s ====[^=]*/.exec(contents)?.[0] ?? '',
            /====\[\[Hex\]\]es ====[^=]*/.exec(contents)?.[0] ?? '',
            /==== \[\[State\]\]s ====[^=]*/.exec(contents)?.[0] ?? '',
            /====\[\[Artifact\]\]s====[^=]*/.exec(contents)?.[0] ?? '',
            /====\[\[Project\]\]s====[^=]*/.exec(contents)?.[0] ?? '',
            /=== Ways ===[^=]*/.exec(contents)?.[0] ?? '',
            /== Card List ==[^=]*/.exec(wikiText)?.[0] ?? '',
        ].forEach((contentSection: WikiText) =>
            this.updateMapForContentSection(
                expansionCardsMap,
                expansionPage.pageid,
                contentSection,
            ),
        );

        if (expansionCardsMap.size > 1) {
            this.addCardsFromFirstToSecondEdition(expansionCardsMap, expansionPage);
        }

        const removedCards: WikiText =
            /=== Removed first-edition Kingdom cards ===[^=]*/.exec(contents)?.[0] ?? '';
        this.updateMapForContentSection(expansionCardsMap, expansionPage.pageid, removedCards);

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

    private updateMapForContentSection(
        expansionCardsMap: Map<number, string[]>,
        expansionId: number,
        contentSection: WikiText,
    ): void {
        const cardRegex = /{{(?:Card|Event|Landmark|Boon|Hex|State|Artifact|Project|Way)\|(.*?)}}(\*?)/g;
        let match: RegExpExecArray | null;
        while ((match = cardRegex.exec(contentSection))) {
            const card = match?.[1];
            expansionId = match?.[2] === '*' ? expansionId + 0.1 : expansionId;

            if (!expansionCardsMap.has(expansionId)) {
                expansionCardsMap.set(expansionId, []);
            }

            const cards = expansionCardsMap.get(expansionId);
            if (cards?.includes(card)) {
                continue;
            }

            cards?.push(card);
        }
    }
}
