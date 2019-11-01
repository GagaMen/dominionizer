import { Card } from './card';

export interface SetResult {
    cards: Card[];
    events?: Card[];
    landmarks?: Card[];
    boons?: Card[];
    hexes?: Card[];
    states?: Card[];
}
