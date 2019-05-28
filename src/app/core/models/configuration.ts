import { Extension } from './extension';
import { Options } from './options';

export interface Configuration {
    extensions: Extension[];
    options: Options;
}
