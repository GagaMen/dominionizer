import { Extension } from './extension';
import { CardType } from './card-type';

export interface Card {
    id: number;
    name: string;
    description: string;
    extension: Extension;
    types: CardType[];
    cost: number;
    debt?: number;
    points?: number;
    money?: number;
    draws?: number;
    actions?: number;
    purchases?: number;
    potion?: boolean;
}
