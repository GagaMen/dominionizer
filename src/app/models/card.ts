import { Expansion } from './expansion';
import { CardType, CardTypeV2 } from './card-type';
import { Dependency } from './dependency';
import { Edition } from './edition';

export const NullCard: Card = {
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

export interface Card {
    id: number;
    name: string;
    description: string;
    image: string;
    wikiUrl: string;
    expansions: Expansion[];
    types: CardType[];
    isKingdomCard: boolean;
    cost: number;
    costModifier?: string;
    debt?: number;
    dependencies?: Dependency[];
}

export interface CardV2 {
    id: number;
    name: string;
    description: string;
    image: string;
    illustrator: string;
    wikiUrl: string;
    editions: Edition[];
    types: CardTypeV2[];
    isKingdomCard: boolean;
    cost: number;
    costModifier?: string;
    debt?: number;
    dependencies?: Dependency[];
}

export type CardTranslation = Pick<Card, 'id' | 'name' | 'description'>;
