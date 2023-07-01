import * as sharp from 'sharp';
import { Sharp } from 'sharp';

export class SharpFactory {
    create(input: Buffer): Sharp {
        return sharp(input);
    }
}
