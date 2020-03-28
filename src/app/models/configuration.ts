import { Expansion } from './expansion';
import { Options } from './options';

export interface Configuration {
    expansions: Expansion[];
    options: Options;
    costDistribution: Map<number, number>;
}
