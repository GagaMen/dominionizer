import { createSpyObj, SpyObj } from '../../testing/spy-obj';
import { when } from 'vitest-when';
import type { Mock } from 'vitest';

import { EncodedImage, ImageBuilder } from './image-builder';
import { ImagePage } from '../wiki-client/api-models';
import { WikiClient } from '../wiki-client/wiki-client';
import { Sharp } from 'sharp';
import { SharpFactory } from './sharp-factory';

describe('ImageBuilder', () => {
    let imageBuilder: ImageBuilder;
    let wikiClientSpy: SpyObj<WikiClient>;
    let sharpFactorySpy: SpyObj<SharpFactory>;
    let sharpSpy: SpyObj<Sharp>;
    let consoleErrorSpy: Mock;

    beforeEach(() => {
        wikiClientSpy = createSpyObj<WikiClient>({
            fetchImage: vi.fn(),
        });

        sharpSpy = createSpyObj<Sharp>({
            jpeg: vi.fn(),
            metadata: vi.fn(),
            png: vi.fn(),
            resize: vi.fn(),
            timeout: vi.fn(),
            toBuffer: vi.fn(),
        });
        sharpSpy.jpeg.mockReturnValue(sharpSpy);
        sharpSpy.metadata.mockResolvedValue({ width: 100, height: 100 });
        sharpSpy.png.mockReturnValue(sharpSpy);
        sharpSpy.resize.mockReturnValue(sharpSpy);
        sharpSpy.timeout.mockReturnValue(sharpSpy);

        sharpFactorySpy = createSpyObj<SharpFactory>({
            create: vi.fn(),
        });

        consoleErrorSpy = vi.spyOn(console, 'error').mockReturnValue(undefined);

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
            when(wikiClientSpy.fetchImage)
                .calledWith(imagePage.imageinfo[0].url)
                .thenResolve(fetchedImage);
            when(sharpFactorySpy.create).calledWith(fetchedImage).thenReturn(sharpSpy);
            sharpSpy.toBuffer.mockResolvedValue(optimizedImage as never);

            const actual = await imageBuilder.build(imagePage);

            expect(actual).toEqual(expected);
            expect(sharpSpy.resize).toHaveBeenCalledWith({ height: 40 });
            expect(sharpSpy.timeout).toHaveBeenCalledWith({ seconds: 15 });
            expect(Math.min(...vi.mocked(sharpSpy.resize).mock.invocationCallOrder)).toBeLessThan(
                Math.min(...vi.mocked(sharpSpy.png).mock.invocationCallOrder),
            );
            expect(Math.min(...vi.mocked(sharpSpy.png).mock.invocationCallOrder)).toBeLessThan(
                Math.min(...vi.mocked(sharpSpy.timeout).mock.invocationCallOrder),
            );
            expect(Math.min(...vi.mocked(sharpSpy.timeout).mock.invocationCallOrder)).toBeLessThan(
                Math.min(...vi.mocked(sharpSpy.toBuffer).mock.invocationCallOrder),
            );
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
            when(wikiClientSpy.fetchImage)
                .calledWith(imagePage.imageinfo[0].url)
                .thenResolve(fetchedImage);
            when(sharpFactorySpy.create).calledWith(fetchedImage).thenReturn(sharpSpy);
            sharpSpy.toBuffer.mockResolvedValue(optimizedImage as never);

            const actual = await imageBuilder.build(imagePage);

            expect(actual).toEqual(expected);
            expect(sharpSpy.jpeg).toHaveBeenCalledWith({ mozjpeg: true });
            expect(sharpSpy.timeout).toHaveBeenCalledWith({ seconds: 15 });
            expect(Math.min(...vi.mocked(sharpSpy.resize).mock.invocationCallOrder)).toBeLessThan(
                Math.min(...vi.mocked(sharpSpy.jpeg).mock.invocationCallOrder),
            );
            expect(Math.min(...vi.mocked(sharpSpy.jpeg).mock.invocationCallOrder)).toBeLessThan(
                Math.min(...vi.mocked(sharpSpy.timeout).mock.invocationCallOrder),
            );
            expect(Math.min(...vi.mocked(sharpSpy.timeout).mock.invocationCallOrder)).toBeLessThan(
                Math.min(...vi.mocked(sharpSpy.toBuffer).mock.invocationCallOrder),
            );
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
            sharpFactorySpy.create.mockReturnValue(sharpSpy);
            sharpSpy.metadata.mockResolvedValue({ width: 354, height: 246 });

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
            sharpFactorySpy.create.mockReturnValue(sharpSpy);
            sharpSpy.metadata.mockResolvedValue({ width: 452, height: 177 });

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
            sharpFactorySpy.create.mockReturnValue(sharpSpy);
            sharpSpy.metadata.mockResolvedValue({ width: 287, height: 374 });

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
            sharpFactorySpy.create.mockReturnValue(sharpSpy);
            sharpSpy.toBuffer.mockRejectedValue(new Error('any-error'));

            const actual = await imageBuilder.build(imagePage);

            expect(actual).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('any-error'));
        });
    });
});
