import { Expansion } from './expansion';
import { CardType } from './card-type';

export interface Card {
    id: number;
    name: string;
    description: string;
    expansions: Expansion[];
    types: CardType[];
    cost?: number;
    debt?: number;
    points?: number;
    money?: number;
    draws?: number;
    actions?: number;
    purchases?: number;
    potion?: boolean;
}
