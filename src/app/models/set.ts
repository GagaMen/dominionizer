import { Card } from './card';

export type SetPartName = 'kingdomCards' | 'specialCards';

export interface Set {
    kingdomCards: Card[];
    specialCards: Card[];
}
