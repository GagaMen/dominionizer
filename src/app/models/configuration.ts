import { Expansion } from './expansion';
import { SpecialCardsCount } from './special-cards-count';

export interface Configuration {
    expansions: Expansion[];
    specialCardsCount: SpecialCardsCount;
    costDistribution: Map<number, number>;
}
