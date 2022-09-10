import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { CardType } from '../../../../../src/app/models/card-type';
import { DependencyType } from '../../../../../src/app/models/dependency';

export class SplitPileDependencyBuilder {
    build(cardDtos: CardDto[], cardTypes: CardType[]): CardDto[] {
        const splitPiles: Map<number, CardDto[]> = new Map();

        this.buildSplitPilesWithCardTypes(splitPiles, cardDtos, cardTypes);

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
