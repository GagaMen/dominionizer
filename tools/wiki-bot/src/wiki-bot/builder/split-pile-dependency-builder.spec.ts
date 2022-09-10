import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { CardType } from '../../../../../src/app/models/card-type';
import { DependencyType } from '../../../../../src/app/models/dependency';
import { SplitPileDependencyBuilder } from './split-pile-dependency-builder';

describe('SplitPileDependencyBuilder', () => {
    let splitPileDependecyBuilder: SplitPileDependencyBuilder;

    beforeEach(() => {
        splitPileDependecyBuilder = new SplitPileDependencyBuilder();
    });

    describe('build', () => {
        it('should build split pile dependencies with card types correctly', () => {
            const cards: CardDto[] = [
                { id: 1, types: [10] } as CardDto,
                { id: 2, types: [2] } as CardDto,
                { id: 3, types: [2, 10] } as CardDto,
            ];
            const cardTypes: CardType[] = [{ id: 2 } as CardType];
            const expected: CardDto[] = [
                { id: 1, types: [10] } as CardDto,
                {
                    id: 2,
                    types: [2],
                    dependencies: [
                        { id: 2, type: DependencyType.SplitPile },
                        { id: 3, type: DependencyType.SplitPile },
                    ],
                } as CardDto,
                {
                    id: 3,
                    types: [2, 10],
                    dependencies: [{ id: 2, type: DependencyType.SplitPile }],
                } as CardDto,
            ];

            const actual = splitPileDependecyBuilder.build(cards, cardTypes);

            expect(actual).toEqual(expected);
        });
    });
});
