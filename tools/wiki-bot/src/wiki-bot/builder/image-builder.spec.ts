/* eslint-disable @typescript-eslint/unbound-method */
import { EncodedImage, ImageBuilder } from './image-builder';
import { ImagePage } from '../wiki-client/api-models';
import { WikiClient } from '../wiki-client/wiki-client';
import { Metadata, Sharp } from 'sharp';
import { SharpFactory } from './sharp-factory';

describe('ImageBuilder', () => {
    let imageBuilder: ImageBuilder;
    let wikiClientSpy: jasmine.SpyObj<WikiClient>;
    let sharpFactorySpy: jasmine.SpyObj<SharpFactory>;
    let sharpSpy: jasmine.SpyObj<Sharp>;
    let consoleErrorSpy: jasmine.Spy;

    beforeEach(() => {
        wikiClientSpy = jasmine.createSpyObj<WikiClient>('WikiClient', ['fetchImage']);

        sharpSpy = jasmine.createSpyObj<Sharp>('Sharp', [
            'jpeg',
            'metadata',
            'png',
            'resize',
            'timeout',
            'toBuffer',
        ]);
        sharpSpy.jpeg.and.returnValue(sharpSpy);
        sharpSpy.metadata.and.resolveTo({ width: 100, height: 100 } as Metadata);
        sharpSpy.png.and.returnValue(sharpSpy);
        sharpSpy.resize.and.returnValue(sharpSpy);
        sharpSpy.timeout.and.returnValue(sharpSpy);

        sharpFactorySpy = jasmine.createSpyObj<SharpFactory>('SharpFactory', ['create']);

        consoleErrorSpy = spyOn(console, 'error').and.stub();

        imageBuilder = new ImageBuilder(wikiClientSpy, sharpFactorySpy);
    });

    describe('build', () => {
        it('with card symbol should build correctly optimized image', async () => {
            const imagePage: ImagePage = {
                pageid: 6769,
                title: 'File:Menagerie (expansion) icon.png',
                imageinfo: [
                    {
                        url: 'https://wiki.dominionstrategy.com/images/d/d4/Menagerie_%28expansion%29_icon.png',
                        mime: 'image/png',
                    },
                ],
            };
            const fetchedImage: Buffer = Buffer.from([1, 2, 3]);
            const optimizedImage: Buffer = Buffer.from([4, 5, 6]);
            const expected: EncodedImage = {
                id: 6769,
                fileName: 'Menagerie_icon.png',
                data: new Uint8Array(optimizedImage),
            };
            wikiClientSpy.fetchImage
                .withArgs(imagePage.imageinfo[0].url)
                .and.resolveTo(fetchedImage);
            sharpFactorySpy.create.withArgs(fetchedImage).and.returnValue(sharpSpy);
            sharpSpy.toBuffer.and.resolveTo(optimizedImage as never);

            const actual = await imageBuilder.build(imagePage);

            expect(actual).toEqual(expected);
            expect(sharpSpy.resize).toHaveBeenCalledWith({ height: 40 });
            expect(sharpSpy.timeout).toHaveBeenCalledWith({ seconds: 15 });
            expect(sharpSpy.resize).toHaveBeenCalledBefore(sharpSpy.png);
            expect(sharpSpy.png).toHaveBeenCalledBefore(sharpSpy.timeout);
            expect(sharpSpy.timeout).toHaveBeenCalledBefore(sharpSpy.toBuffer);
        });

        it('with card art should build correctly optimized image', async () => {
            const imagePage: ImagePage = {
                pageid: 1707,
                title: 'File:Bag Of GoldArt.jpg',
                imageinfo: [
                    {
                        url: 'https://wiki.dominionstrategy.com/images/5/5a/Bag_Of_GoldArt.jpg',
                        mime: 'image/jpeg',
                    },
                ],
            };
            const fetchedImage: Buffer = Buffer.from([1, 2, 3]);
            const optimizedImage: Buffer = Buffer.from([4, 5, 6]);
            const expected: EncodedImage = {
                id: 1707,
                fileName: 'Bag_Of_GoldArt.jpg',
                data: new Uint8Array(optimizedImage),
            };
            wikiClientSpy.fetchImage
                .withArgs(imagePage.imageinfo[0].url)
                .and.resolveTo(fetchedImage);
            sharpFactorySpy.create.withArgs(fetchedImage).and.returnValue(sharpSpy);
            sharpSpy.toBuffer.and.resolveTo(optimizedImage as never);

            const actual = await imageBuilder.build(imagePage);

            expect(actual).toEqual(expected);
            expect(sharpSpy.jpeg).toHaveBeenCalledWith({ mozjpeg: true });
            expect(sharpSpy.timeout).toHaveBeenCalledWith({ seconds: 15 });
            expect(sharpSpy.resize).toHaveBeenCalledBefore(sharpSpy.jpeg);
            expect(sharpSpy.jpeg).toHaveBeenCalledBefore(sharpSpy.timeout);
            expect(sharpSpy.timeout).toHaveBeenCalledBefore(sharpSpy.toBuffer);
        });

        it('with card art for kingdom card should resize image correctly', async () => {
            const imagePage: ImagePage = {
                pageid: 1754,
                title: 'File:Abandoned MineArt.jpg',
                imageinfo: [
                    {
                        url: 'https://wiki.dominionstrategy.com/images/a/ae/Abandoned_MineArt.jpg',
                        mime: 'image/jpeg',
                    },
                ],
            };
            sharpFactorySpy.create.and.returnValue(sharpSpy);
            sharpSpy.metadata.and.resolveTo({ width: 354, height: 246 } as Metadata);

            await imageBuilder.build(imagePage);

            expect(sharpSpy.resize).toHaveBeenCalledWith({ width: 300 });
        });

        it('with card art for special card should resize image correctly', async () => {
            const imagePage: ImagePage = {
                pageid: 6230,
                title: 'File:AcademyArt.jpg',
                imageinfo: [
                    {
                        url: 'https://wiki.dominionstrategy.com/images/3/38/AcademyArt.jpg',
                        mime: 'image/jpeg',
                    },
                ],
            };
            sharpFactorySpy.create.and.returnValue(sharpSpy);
            sharpSpy.metadata.and.resolveTo({ width: 452, height: 177 } as Metadata);

            await imageBuilder.build(imagePage);

            expect(sharpSpy.resize).toHaveBeenCalledWith({ width: 300 });
        });

        it('with card art for supply card should resize image correctly', async () => {
            const imagePage: ImagePage = {
                pageid: 3698,
                title: 'File:CopperArt.jpg',
                imageinfo: [
                    {
                        url: 'https://wiki.dominionstrategy.com/images/6/62/CopperArt.jpg',
                        mime: 'image/jpeg',
                    },
                ],
            };
            sharpFactorySpy.create.and.returnValue(sharpSpy);
            sharpSpy.metadata.and.resolveTo({ width: 287, height: 374 } as Metadata);

            await imageBuilder.build(imagePage);

            expect(sharpSpy.resize).toHaveBeenCalledWith({ width: 150 });
        });

        it('with Sharp throws an error should return null', async () => {
            const imagePage: ImagePage = {
                pageid: 6769,
                title: 'File:Menagerie (expansion) icon.png',
                imageinfo: [
                    {
                        url: 'https://wiki.dominionstrategy.com/images/d/d4/Menagerie_%28expansion%29_icon.png',
                        mime: 'image/png',
                    },
                ],
            };
            sharpFactorySpy.create.and.returnValue(sharpSpy);
            sharpSpy.toBuffer.and.rejectWith(new Error('any-error'));

            const actual = await imageBuilder.build(imagePage);

            expect(actual).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith(jasmine.stringContaining('any-error'));
        });
    });
});
