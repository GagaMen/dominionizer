import { DataFixture } from '../../../../../src/testing/data-fixture';
import { CardDto } from '../../../../../src/app/dtos/card-dto';
import { CardType, CardTypeId } from '../../../../../src/app/models/card-type';
import { DependencyType } from '../../../../../src/app/models/dependency';
import { ContentPage } from '../wiki-client/api-models';
import { SplitPileDependencyBuilder } from './split-pile-dependency-builder';

describe('SplitPileDependencyBuilder', () => {
    let splitPileDependecyBuilder: SplitPileDependencyBuilder;
    let dataFixture: DataFixture;
    const nullSplitPilePage: ContentPage = {
        pageid: 0,
        title: '',
        revisions: [{ '*': '' }],
    };

    beforeEach(() => {
        dataFixture = new DataFixture();

        splitPileDependecyBuilder = new SplitPileDependencyBuilder();
    });

    describe('build', () => {
        it('should build split pile dependencies with card types correctly', () => {
            const cards: CardDto[] = [
                { id: 1, types: [CardTypeId.Action], isKingdomCard: true } as CardDto,
                { id: CardTypeId.Augur, types: [CardTypeId.Augur], isKingdomCard: true } as CardDto,
                {
                    id: 3,
                    types: [CardTypeId.Action, CardTypeId.Augur],
                    isKingdomCard: true,
                } as CardDto,
                { id: 4, types: [CardTypeId.Boon], isKingdomCard: false } as CardDto,
            ];
            const cardTypes: CardType[] = [
                dataFixture.createCardType({ id: CardTypeId.Augur }),
                dataFixture.createCardType({ id: CardTypeId.Boon }),
            ];
            const expected: CardDto[] = [
                { id: 1, types: [CardTypeId.Action], isKingdomCard: true } as CardDto,
                {
                    id: CardTypeId.Augur,
                    types: [CardTypeId.Augur],
                    isKingdomCard: true,
                    dependencies: [
                        { id: CardTypeId.Augur, type: DependencyType.SplitPile },
                        { id: 3, type: DependencyType.SplitPile },
                    ],
                } as CardDto,
                {
                    id: 3,
                    types: [CardTypeId.Action, CardTypeId.Augur],
                    isKingdomCard: true,
                    dependencies: [{ id: CardTypeId.Augur, type: DependencyType.SplitPile }],
                } as CardDto,
                { id: 4, types: [CardTypeId.Boon], isKingdomCard: false } as CardDto,
            ];

            const actual = splitPileDependecyBuilder.build(cards, cardTypes, nullSplitPilePage);

            expect(actual).toEqual(expected);
        });

        it('should build split pile dependencies with split pile page correctly', () => {
            const cards: CardDto[] = [
                { id: 1, name: 'Encampment', types: [] as number[] } as CardDto,
                { id: 2, name: 'Plunder', types: [] as number[] } as CardDto,
                { id: 3, name: 'Townsfolk', types: [] as number[] } as CardDto,
                { id: 4, name: 'Castles', types: [] as number[] } as CardDto,
                { id: 5, name: 'Catapult', types: [] as number[] } as CardDto,
                { id: 6, name: 'Rocks', types: [] as number[] } as CardDto,
            ];
            const splitPilePage: ContentPage = {
                pageid: 3247,
                title: 'Split pile',
                revisions: [
                    {
                        '*':
                            `== List of split pile cards ==\n\n` +
                            `Piles are sorted by the cost...\n\n` +
                            `{{Cost|2}} {{Card|Encampment}}/{{Card|Plunder}}, {{Card|Townsfolk}}\n` +
                            `{{Cost|3}} {{Card|Castles}}, {{ card | Catapult | oi=1 }} / {{ card | Rocks | oi=1 }}\n`,
                    },
                ],
            };
            const expected: CardDto[] = [
                {
                    id: 1,
                    name: 'Encampment',
                    types: [] as number[],
                    dependencies: [
                        { id: 1, type: DependencyType.SplitPile },
                        { id: 2, type: DependencyType.SplitPile },
                    ],
                } as CardDto,
                {
                    id: 2,
                    name: 'Plunder',
                    types: [] as number[],
                    dependencies: [{ id: 1, type: DependencyType.SplitPile }],
                } as CardDto,
                { id: 3, name: 'Townsfolk', types: [] as number[] } as CardDto,
                { id: 4, name: 'Castles', types: [] as number[] } as CardDto,
                {
                    id: 5,
                    name: 'Catapult',
                    types: [] as number[],
                    dependencies: [
                        { id: 5, type: DependencyType.SplitPile },
                        { id: 6, type: DependencyType.SplitPile },
                    ],
                } as CardDto,
                {
                    id: 6,
                    name: 'Rocks',
                    types: [] as number[],
                    dependencies: [{ id: 5, type: DependencyType.SplitPile }],
                } as CardDto,
            ];

            const actual = splitPileDependecyBuilder.build(cards, [], splitPilePage);

            expect(actual).toEqual(expected);
        });
    });
});
