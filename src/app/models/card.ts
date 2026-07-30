import { CardType } from './card-type';
import { Edition } from './edition';

export const NullCard: Card = {
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

export interface Card {
    id: string;
    name: string;
    description: string;
    image: string;
    illustrator: string;
    wikiUrl: string;
    editions: Edition[];
    types: CardType[];
    isKingdomCard: boolean;
    cost: number;
    costModifier?: string;
    debt?: number;
}

export type CardTranslation = Pick<Card, 'id' | 'name' | 'description'>;
