import { DependencyDto } from './dependency-dto';

export interface CardDto {
    id: number;
    name: string;
    description?: string;
    expansions: number[];
    types: number[];
    isKingdomCard: boolean;
    dependencies?: DependencyDto[];
    isPartOfSplitPile?: boolean;
    isOnTopOfSplitPile?: boolean;
    cost: number;
    potion?: boolean;
    debt?: number;
    points?: number;
    money?: number;
    draws?: number;
    actions?: number;
    purchases?: number;
    image?: string;
}
