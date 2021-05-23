import { DependencyDto } from './dependency-dto';

export interface CardDto {
    id: number;
    name: string;
    description: string[];
    image: string;
    wikiUrl: string;
    expansions: number[];
    types: number[];
    isKingdomCard: boolean;
    cost: number;
    potion?: boolean;
    debt?: number;
    dependencies?: DependencyDto[];
}
