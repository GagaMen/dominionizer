/* eslint-disable @typescript-eslint/unbound-method */
import { EncodedImage, ImageBuilder } from './image-builder';
import { ImagePool, Image, EncoderOptions, EncodeResult } from '@squoosh/lib';
import { ImagePage } from '../wiki-client/api-models';
import { WikiClient } from '../wiki-client/wiki-client';

describe('ImageBuilder', () => {
    let imageBuilder: ImageBuilder;
    let wikiClientSpy: jasmine.SpyObj<WikiClient>;
    let imagePoolSpy: jasmine.SpyObj<ImagePool>;
    let imageSpy: jasmine.SpyObj<Image>;

    beforeEach(() => {
        wikiClientSpy = jasmine.createSpyObj<WikiClient>('WikiClient', ['fetchImage']);
        imagePoolSpy = jasmine.createSpyObj<ImagePool>('ImagePool', ['ingestImage', 'close']);

        imageSpy = jasmine.createSpyObj<Image>('Image', ['preprocess', 'encode']);
        imageSpy.encodedWith = {};
        imageSpy.decoded = Promise.resolve({
            bitmap: {
                width: 100,
                height: 100,
            } as ImageData,
        });
        imageSpy.encode.and.resolveTo({});

        imageBuilder = new ImageBuilder(wikiClientSpy, imagePoolSpy);
    });

    describe('build', () => {
        it('with card symbol should build correctly encoded image', async () => {
            const imagePage: ImagePage = {
                pageid: 6769,
                title: 'File:Menagerie (expansion) icon.png',
                imageinfo: [
                    {
                        url:
                            'http://wiki.dominionstrategy.com/images/d/d4/Menagerie_%28expansion%29_icon.png',
                        mime: 'image/png',
                    },
                ],
            };
            const fetchedImage: Buffer = Buffer.from([1, 2, 3]);
            const encoderOptions: EncoderOptions = {
                oxipng: {},
            };
            const encodedImageData: Uint8Array = new Uint8Array([1, 2, 3]);
            imageSpy.encodedWith.oxipng = Promise.resolve({
                binary: encodedImageData,
            } as EncodeResult);
            const expected: EncodedImage = {
                id: 6769,
                fileName: 'Menagerie_icon.png',
                data: encodedImageData,
            };
            wikiClientSpy.fetchImage
                .withArgs(imagePage.imageinfo[0].url)
                .and.resolveTo(fetchedImage);
            imagePoolSpy.ingestImage.withArgs(fetchedImage).and.returnValue(imageSpy);
            imageSpy.encode.withArgs(encoderOptions);

            const actual = await imageBuilder.build(imagePage);

            expect(actual).toEqual(expected);
        });

        it('with card symbol should preprocess image correctly', async () => {
            const imagePage: ImagePage = {
                pageid: 6769,
                title: 'File:Menagerie (expansion) icon.png',
                imageinfo: [
                    {
                        url:
                            'http://wiki.dominionstrategy.com/images/d/d4/Menagerie_%28expansion%29_icon.png',
                        mime: 'image/png',
                    },
                ],
            };
            const preprocessOptions = {
                resize: {
                    width: 40,
                    height: 40,
                },
            };
            imagePoolSpy.ingestImage.and.returnValue(imageSpy);

            await imageBuilder.build(imagePage);

            expect(imageSpy.preprocess).toHaveBeenCalledWith(preprocessOptions);
            expect(imageSpy.preprocess).toHaveBeenCalledBefore(imageSpy.encode);
        });

        it('with card art should build correctly encoded image', async () => {
            const imagePage: ImagePage = {
                pageid: 1707,
                title: 'File:Bag Of GoldArt.jpg',
                imageinfo: [
                    {
                        url: 'http://wiki.dominionstrategy.com/images/5/5a/Bag_Of_GoldArt.jpg',
                        mime: 'image/jpeg',
                    },
                ],
            };
            const fetchedImage: Buffer = Buffer.from([1, 2, 3]);
            const encoderOptions: EncoderOptions = {
                mozjpeg: {},
            };
            const encodedImageData: Uint8Array = new Uint8Array([1, 2, 3]);
            imageSpy.encodedWith.mozjpeg = Promise.resolve({
                binary: encodedImageData,
            } as EncodeResult);

            const expected: EncodedImage = {
                id: 1707,
                fileName: 'Bag_Of_GoldArt.jpg',
                data: encodedImageData,
            };
            wikiClientSpy.fetchImage
                .withArgs(imagePage.imageinfo[0].url)
                .and.resolveTo(fetchedImage);
            imagePoolSpy.ingestImage.withArgs(fetchedImage).and.returnValue(imageSpy);
            imageSpy.encode.withArgs(encoderOptions);

            const actual = await imageBuilder.build(imagePage);

            expect(actual).toEqual(expected);
        });

        it('with card art for kingdom card should preprocess image correctly', async () => {
            const imagePage: ImagePage = {
                pageid: 1754,
                title: 'File:Abandoned MineArt.jpg',
                imageinfo: [
                    {
                        url: 'http://wiki.dominionstrategy.com/images/a/ae/Abandoned_MineArt.jpg',
                        mime: 'image/jpeg',
                    },
                ],
            };
            imageSpy.decoded = Promise.resolve({
                bitmap: {
                    width: 354,
                    height: 246,
                } as ImageData,
            });
            const preprocessOptions = {
                resize: {
                    width: 300,
                    height: 215,
                },
            };
            imagePoolSpy.ingestImage.and.returnValue(imageSpy);

            await imageBuilder.build(imagePage);

            expect(imageSpy.preprocess).toHaveBeenCalledWith(preprocessOptions);
            expect(imageSpy.preprocess).toHaveBeenCalledBefore(imageSpy.encode);
        });

        it('with card art for special card should preprocess image correctly', async () => {
            const imagePage: ImagePage = {
                pageid: 6230,
                title: 'File:AcademyArt.jpg',
                imageinfo: [
                    {
                        url: 'http://wiki.dominionstrategy.com/images/3/38/AcademyArt.jpg',
                        mime: 'image/jpeg',
                    },
                ],
            };
            imageSpy.decoded = Promise.resolve({
                bitmap: {
                    width: 452,
                    height: 177,
                } as ImageData,
            });
            const preprocessOptions = {
                resize: {
                    width: 300,
                    height: 118,
                },
            };
            imagePoolSpy.ingestImage.and.returnValue(imageSpy);

            await imageBuilder.build(imagePage);

            expect(imageSpy.preprocess).toHaveBeenCalledWith(preprocessOptions);
            expect(imageSpy.preprocess).toHaveBeenCalledBefore(imageSpy.encode);
        });

        it('with card art for supply card should preprocess image correctly', async () => {
            const imagePage: ImagePage = {
                pageid: 3698,
                title: 'File:CopperArt.jpg',
                imageinfo: [
                    {
                        url: 'http://wiki.dominionstrategy.com/images/6/62/CopperArt.jpg',
                        mime: 'image/jpeg',
                    },
                ],
            };
            imageSpy.decoded = Promise.resolve({
                bitmap: {
                    width: 287,
                    height: 374,
                } as ImageData,
            });
            const preprocessOptions = {
                resize: {
                    width: 150,
                    height: 196,
                },
            };
            imagePoolSpy.ingestImage.and.returnValue(imageSpy);

            await imageBuilder.build(imagePage);

            expect(imageSpy.preprocess).toHaveBeenCalledWith(preprocessOptions);
            expect(imageSpy.preprocess).toHaveBeenCalledBefore(imageSpy.encode);
        });
    });
});
