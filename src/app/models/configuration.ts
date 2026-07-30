import { Edition } from './edition';
import { SpecialCardsCount } from './special-cards-count';

export interface Configuration {
    editions: Edition[];
    specialCardsCount: SpecialCardsCount;
}
