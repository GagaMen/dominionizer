import { SharpFactory } from './sharp-factory';

describe('SharpFactory', () => {
    let sharpFactory: SharpFactory;

    beforeEach(() => {
        sharpFactory = new SharpFactory();
    });

    describe('create', () => {
        it('should return with input initialized sharp instance', async () => {
            // data represent a png with a white pixel
            const input = Buffer.from([
                137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0,
                1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 9, 112, 72, 89, 115, 0, 0, 3, 232, 0,
                0, 3, 232, 1, 181, 123, 82, 107, 0, 0, 0, 12, 73, 68, 65, 84, 120, 156, 99, 248,
                255, 255, 63, 0, 5, 254, 2, 254, 13, 239, 70, 184, 0, 0, 0, 0, 73, 69, 78, 68, 174,
                66, 96, 130,
            ]);

            const actual = sharpFactory.create(input);

            await expectAsync(actual.toBuffer()).toBeResolvedTo(input);
        });
    });
});
