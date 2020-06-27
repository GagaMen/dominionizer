import { Card } from './card';

export type SetPartName = 'cards' | 'events' | 'landmarks' | 'projects' | 'ways';

export interface Set {
    cards: Card[];
    events: Card[];
    landmarks: Card[];
    projects: Card[];
    ways: Card[];
}
