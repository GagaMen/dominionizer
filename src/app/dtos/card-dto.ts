import { DependencyDto } from './dependency-dto';

export const NullCardDto: CardDto = {
    id: 0,
    name: '',
    description: '',
    image: '',
    wikiUrl: '',
    expansions: [],
    types: [],
    isKingdomCard: false,
    cost: 0,
};

export interface CardDto {
    id: number;
    name: string;
    description: string;
    image: string;
    wikiUrl: string;
    expansions: number[];
    types: number[];
    isKingdomCard: boolean;
    cost: number;
    costModifier?: string;
    debt?: number;
    dependencies?: DependencyDto[];
}
