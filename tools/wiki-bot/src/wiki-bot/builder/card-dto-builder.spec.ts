import { CardTypePage, CargoCard } from './../wiki-client/api-models';
import { CardPage } from '../wiki-client/api-models';
import { CardDtoBuilder } from './card-dto-builder';
import { CardDtoV2 } from '../../../../../src/app/dtos/card-dto';
import { CardTypeV2 } from '../../../../../src/app/models/card-type';
import { Edition } from 'src/app/models/edition';

describe('CardDtoBuilder', () => {
    let cardDtoBuilder: CardDtoBuilder;

    const editions: Edition[] = [
        { id: '215', expansion: 'Dominion', edition: '2', icon: '' },
        { id: '216', expansion: 'Dominion', edition: '1', icon: '' },
        { id: '218', expansion: 'Allies', edition: '1', icon: '' },
        { id: '237', expansion: 'Dark Ages', edition: '1', icon: '' },
    ];
    const cardTypesV2: CardTypeV2[] = [
        { id: '241', name: 'Action', scope: '' },
        { id: '242', name: 'Attack', scope: '' },
        { id: '251', name: 'Knight', scope: '' },
    ];
    const nullCargoCard: CargoCard = {
        Id: '',
        PageId: '',
        Name: '',
        Expansion: '',
        Purpose: 'Kingdom Pile',
        CostCoin: '',
        CostPotion: '0',
        CostDebt: '',
        CostExtra: '',
        Art: '',
        Illustrator: '',
        Edition: '',
        Types: '',
    };
    const nullCardPage: CardPage = {
        pageid: 0,
        title: '',
        fullurl: '',
        revisions: [{ '*': '' }],
    };
    const nullCardDtoV2: CardDtoV2 = {
        id: '',
        name: '',
        description: '',
        image: '',
        illustrator: '',
        wikiUrl: '',
        editions: [],
        types: [],
        isKingdomCard: true,
        cost: 0,
        costModifier: undefined,
        debt: undefined,
    };

    beforeEach(() => {
        cardDtoBuilder = new CardDtoBuilder();
    });

    describe('buildFromCargo', () => {
        it('with basic cargoCard should return correct card', () => {
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                Id: '5006',
                PageId: '8442',
                Name: 'Barbarian',
                Expansion: 'Allies',
                Purpose: 'Kingdom Pile',
                CostCoin: '5',
                CostPotion: '0',
                CostDebt: '',
                CostExtra: '',
                Art: 'BarbarianArt.jpg',
                Illustrator: 'Julien Delval',
                Edition: '1',
                Types: 'Action-Attack',
            };
            const cardPage: CardPage = {
                ...nullCardPage,
                pageid: 8442,
                title: 'Barbarian',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Barbarian',
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\n` +
                            `|text = At the start...\n` +
                            `|text2 = This is gained ...\n}}\n\n`,
                    },
                ],
            };
            const expected: CardDtoV2 = {
                ...nullCardDtoV2,
                id: '5006',
                name: 'Barbarian',
                description: `At the start...{{divline}}This is gained ...`,
                image: 'BarbarianArt.jpg',
                illustrator: 'Julien Delval',
                wikiUrl: 'https://wiki.dominionstrategy.com/index.php/Barbarian',
                editions: ['218'],
                types: ['241', '242'],
                isKingdomCard: true,
                cost: 5,
            };

            const actual = cardDtoBuilder.buildFromCargo(
                cargoCard,
                cardPage,
                editions,
                cardTypesV2,
            );

            expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        it('with cargoCard is in one edition of a multi edition expansion should return correct card', () => {
            const cargoCard = {
                ...nullCargoCard,
                Id: '4823',
                Expansion: 'Dominion',
                Art: '',
                Edition: '1',
                Types: '',
            } as CargoCard;
            const expected: CardDtoV2 = {
                ...nullCardDtoV2,
                id: '4823',
                editions: ['216'],
            };

            const actual = cardDtoBuilder.buildFromCargo(
                cargoCard,
                nullCardPage,
                editions,
                cardTypesV2,
            );

            expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        it('with cargoCard is in all editions of a multi edition expansion should return correct card', () => {
            const cargoCard = {
                ...nullCargoCard,
                Id: '4818',
                Expansion: 'Dominion',
                Art: '',
                Edition: '1&2',
                Types: '',
            } as CargoCard;
            const expected: CardDtoV2 = {
                ...nullCardDtoV2,
                id: '4818',
                editions: ['215', '216'],
            };

            const actual = cardDtoBuilder.buildFromCargo(
                cargoCard,
                nullCardPage,
                editions,
                cardTypesV2,
            );

            expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        it('with cardPage contains <br/> in text1 or text2 should return correct card', () => {
            const cardPage: CardPage = {
                ...nullCardPage,
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\n` +
                            `|text = At the<br/>start...\n` +
                            `|text2 = This is<br/>gained ...\n}}`,
                    },
                ],
            };
            const expected: CardDtoV2 = {
                ...nullCardDtoV2,
                description: `At the<br>start...{{divline}}This is<br>gained ...`,
            };

            const actual = cardDtoBuilder.buildFromCargo(
                nullCargoCard,
                cardPage,
                editions,
                cardTypesV2,
            );

            expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        it('with cargoCard of non-kingdom card should return correct card', () => {
            const cargoCard = {
                ...nullCargoCard,
                Purpose: 'Landscape',
            } as CargoCard;
            const expected: CardDtoV2 = {
                ...nullCardDtoV2,
                isKingdomCard: false,
            };

            const actual = cardDtoBuilder.buildFromCargo(
                cargoCard,
                nullCardPage,
                editions,
                cardTypesV2,
            );

            expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        it('with cargoCard contains cost extra should return correct card', () => {
            const cargoCard = {
                ...nullCargoCard,
                CostExtra: '*',
            } as CargoCard;
            const expected: CardDtoV2 = {
                ...nullCardDtoV2,
                costModifier: '*',
            };

            const actual = cardDtoBuilder.buildFromCargo(
                cargoCard,
                nullCardPage,
                editions,
                cardTypesV2,
            );

            expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        it('with cargoCard contains cost debt should return correct card', () => {
            const cargoCard = {
                ...nullCargoCard,
                CostDebt: '4',
            } as CargoCard;
            const expected: CardDtoV2 = {
                ...nullCardDtoV2,
                debt: 4,
            };

            const actual = cardDtoBuilder.buildFromCargo(
                cargoCard,
                nullCardPage,
                editions,
                cardTypesV2,
            );

            expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        it('with cargoCard contains cost potion should return correct card', () => {
            const cargoCard = {
                ...nullCargoCard,
                CostPotion: '1',
            } as CargoCard;
            const expected: CardDtoV2 = {
                ...nullCardDtoV2,
                costModifier: 'P',
            };

            const actual = cardDtoBuilder.buildFromCargo(
                cargoCard,
                nullCardPage,
                editions,
                cardTypesV2,
            );

            expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        it('with cargoCard of card type should return correct card', () => {
            const cargoCard: CargoCard = {
                ...nullCargoCard,
                Id: '5225',
                PageId: '577',
                Name: 'Knights',
                Expansion: 'Dark Ages',
                Purpose: 'Kingdom Pile',
                CostCoin: '5',
                CostPotion: '0',
                CostDebt: '',
                CostExtra: '',
                Art: 'KnightsArt.jpg',
                Illustrator: 'Matthias Catrein',
                Edition: '1',
                Types: 'Action-Attack-Knight',
            };
            const cardTypePage: CardTypePage = {
                ...nullCardPage,
                pageid: 577,
                title: 'Knights',
                fullurl: 'https://wiki.dominionstrategy.com/index.php/Knights',
                revisions: [
                    {
                        '*':
                            `{{Infobox Card\n` +
                            `|text = At the start...\n` +
                            `|text2 = This is gained ...\n}}\n\n`,
                    },
                ],
            };
            const expected: CardDtoV2 = {
                ...nullCardDtoV2,
                id: '5225',
                name: 'Knights',
                description: `At the start...{{divline}}This is gained ...`,
                image: 'KnightsArt.jpg',
                illustrator: 'Matthias Catrein',
                wikiUrl: 'https://wiki.dominionstrategy.com/index.php/Knights',
                editions: ['237'],
                types: ['241', '242', '251'],
                isKingdomCard: true,
                cost: 5,
            };

            const actual = cardDtoBuilder.buildFromCargo(
                cargoCard,
                cardTypePage,
                editions,
                cardTypesV2,
            );

            expect(actual).toEqual(jasmine.objectContaining(expected));
        });
    });
});
