export interface CardDto {
    id: number;
    name: string;
    description?: string;
    expansions: number[];
    types: number[];
    isKingdomCard: boolean;
    isPartOfSplitPile?: boolean;
    isOnTopOfSplitPile?: boolean;
    cost?: number;
    potion?: boolean;
    debt?: number;
    points?: number;
    money?: number;
    draws?: number;
    actions?: number;
    purchases?: number;
}
