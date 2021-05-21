import { Expansion } from './expansion';
import { CardType } from './card-type';
import { Dependency } from './dependency';

export const NullCard: Card = {
    id: 0,
    name: '',
    expansions: [],
    types: [],
    isKingdomCard: false,
    cost: 0,
};

export interface Card {
    id: number;
    name: string;
    description?: string;
    expansions: Expansion[];
    types: CardType[];
    isKingdomCard: boolean;
    dependencies?: Dependency[];
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

export type CardTranslation = Pick<Card, 'id' | 'name' | 'description'>;
