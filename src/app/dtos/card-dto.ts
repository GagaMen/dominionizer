export const NullCardDto: CardDto = {
    id: '',
    name: '',
    description: '',
    image: '',
    illustrator: '',
    wikiUrl: '',
    editions: [],
    types: [],
    isKingdomCard: false,
    cost: 0,
};

export interface CardDto {
    id: string;
    name: string;
    description: string;
    image: string;
    illustrator: string;
    wikiUrl: string;
    editions: string[];
    types: string[];
    isKingdomCard: boolean;
    cost: number;
    costModifier?: string;
    debt?: number;
}
