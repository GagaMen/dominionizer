/* eslint-disable @typescript-eslint/unbound-method */
import { ImageBuilder } from './image-builder';
import { ImagePool, Image } from '@squoosh/lib';

describe('ImageBuilder', () => {
    let imageBuilder: ImageBuilder;
    let imagePoolSpy: jasmine.SpyObj<ImagePool>;

    beforeEach(() => {
        imagePoolSpy = jasmine.createSpyObj<ImagePool>('ImagePool', ['ingestImage', 'close']);

        imageBuilder = new ImageBuilder(imagePoolSpy);
    });

    describe('build', () => {
        it('should build image correctly', async () => {
            const fetchedImage: Buffer = {} as Buffer;
            const image = jasmine.createSpyObj<Image>('Image', ['preprocess', 'encode']);
            const preprocessOptions = {
                resize: {
                    width: 100,
                    height: 50,
                },
            };
            const encodeOptions = {
                mozjpeg: {}, //an empty object means 'use default settings'
                jxl: {
                    quality: 90,
                },
            };
            imagePoolSpy.ingestImage.withArgs(fetchedImage).and.returnValue(image);

            await imageBuilder.build(fetchedImage, preprocessOptions, encodeOptions);

            expect(imagePoolSpy.ingestImage).toHaveBeenCalledWith(fetchedImage);
            expect(image.preprocess).toHaveBeenCalledWith(preprocessOptions);
            expect(image.encode).toHaveBeenCalledWith(encodeOptions);
        });
    });
});
