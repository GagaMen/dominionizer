import { Card } from './card';

export type SetPartName = 'kingdomCards' | 'events' | 'landmarks' | 'projects' | 'ways';

export interface Set {
    kingdomCards: Card[];
    events: Card[];
    landmarks: Card[];
    projects: Card[];
    ways: Card[];
}
