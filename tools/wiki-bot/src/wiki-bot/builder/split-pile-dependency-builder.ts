import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { CardType } from '../../../../../src/app/models/card-type';
import { DependencyType } from '../../../../../src/app/models/dependency';
import { ContentPage, WikiText } from '../wiki-client/api-models';
import { extractSection, normalize } from './helper-functions';

export class SplitPileDependencyBuilder {
    build(cardDtos: CardDto[], cardTypes: CardType[], splitPilePage: ContentPage): CardDto[] {
        const splitPiles: Map<number, CardDto[]> = new Map();

        this.buildSplitPilesWithCardTypes(splitPiles, cardDtos, cardTypes);
        this.buildSplitPilesWithSplitPilePage(splitPiles, cardDtos, splitPilePage);

        this.buildSplitPileDependencies(splitPiles);

        return cardDtos;
    }

    private buildSplitPilesWithCardTypes(
        splitPiles: Map<number, CardDto[]>,
        cardDtos: CardDto[],
        cardTypes: CardType[],
    ): void {
        for (const cardType of cardTypes) {
            const randomizerCard = cardDtos.find((cardDto: CardDto) => cardDto.id === cardType.id);

            if (randomizerCard === undefined) {
                continue;
            }

            splitPiles.set(randomizerCard.id, [randomizerCard]);
        }

        for (const cardDto of cardDtos) {
            if (splitPiles.has(cardDto.id)) {
                continue;
            }

            const cardTypeId = cardDto.types.find((cardTypeId: number) =>
                splitPiles.has(cardTypeId),
            );
            if (cardTypeId === undefined) {
                continue;
            }

            const splitPile = splitPiles.get(cardTypeId);
            splitPile?.push(cardDto);
        }
    }

    private buildSplitPilesWithSplitPilePage(
        splitPiles: Map<number, CardDto[]>,
        cardDtos: CardDto[],
        splitPilePage: ContentPage,
    ) {
        const wikiText: WikiText = splitPilePage.revisions[0]['*'] ?? '';
        const cardList: WikiText = extractSection(wikiText, 'List of split pile cards', 2);

        const splitPilePairRegex = /{{\s*Card\s*\|([^|}]*)[^}]*?}}\s*\/\s*{{\s*Card\s*\|([^|}]*)[^}]*?}}/gi;
        let match: RegExpExecArray | null;
        while ((match = splitPilePairRegex.exec(cardList))) {
            const topCardName = normalize(match?.[1]);
            const bottomCardName = normalize(match?.[2]);

            const topCardDto = cardDtos.find((cardDto: CardDto) => cardDto.name === topCardName);
            const bottomCardDto = cardDtos.find(
                (cardDto: CardDto) => cardDto.name === bottomCardName,
            );

            if (topCardDto === undefined || bottomCardDto === undefined) {
                continue;
            }

            splitPiles.set(topCardDto?.id, [topCardDto, bottomCardDto]);
        }
    }

    private buildSplitPileDependencies(splitPiles: Map<number, CardDto[]>) {
        for (const [_, splitPileCardDtos] of splitPiles) {
            const dependencies = splitPileCardDtos.map((cardDto: CardDto) => {
                return {
                    id: cardDto.id,
                    type: DependencyType.SplitPile,
                };
            });

            splitPileCardDtos[0].dependencies = dependencies;
            for (const splitPileCardDto of splitPileCardDtos.slice(1)) {
                splitPileCardDto.dependencies = [dependencies[0]];
            }
        }
    }
}
