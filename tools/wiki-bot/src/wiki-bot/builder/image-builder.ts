import { ImagePool, EncoderOptions, PreprocessOptions, Image } from '@squoosh/lib';
import { ImagePage } from '../wiki-client/api-models';
import { WikiClient } from '../wiki-client/wiki-client';

export interface EncodedImage {
    id: number;
    fileName: string;
    data: Uint8Array;
}

export class ImageBuilder {
    constructor(private wikiClient: WikiClient, private imagePool: ImagePool) {}

    async build(imagePage: ImagePage): Promise<EncodedImage> {
        return {
            id: imagePage.pageid,
            fileName: this.buildFileName(imagePage),
            data: await this.buildData(imagePage),
        };
    }

    private buildFileName(imagePage: ImagePage): string {
        return imagePage.title.replace('File:', '').replace('(expansion) ', '').replace(/\s/g, '_');
    }

    private async buildData(imagePage: ImagePage): Promise<Uint8Array> {
        const imageinfo = imagePage.imageinfo[0];
        const rawImage = await this.wikiClient.fetchImage(imageinfo.url);
        const image = this.imagePool.ingestImage(rawImage);

        return imageinfo.mime === 'image/png'
            ? await this.buildDataForCardSymbol(image)
            : await this.buildDataForCardArt(image);
    }

    private async buildDataForCardSymbol(image: Image): Promise<Uint8Array> {
        const preprocessOptions: PreprocessOptions = {
            resize: {
                width: 40,
                height: 40,
            },
        };
        await image.preprocess(preprocessOptions);

        const encoderOptions = { oxipng: {} }; // means default options
        await image.encode<EncoderOptions>(encoderOptions);

        return (await image.encodedWith.oxipng)?.binary ?? new Uint8Array();
    }

    private async buildDataForCardArt(image: Image): Promise<Uint8Array> {
        const decodedImage = await image.decoded;
        const aspectRatio: number = decodedImage.bitmap.width / decodedImage.bitmap.height;

        let preprocessOptions: PreprocessOptions;
        if (aspectRatio < 1) {
            // supply card
            preprocessOptions = {
                resize: {
                    width: 150,
                    height: 196,
                },
            };
        } else if (aspectRatio > 2) {
            // special card
            preprocessOptions = {
                resize: {
                    width: 300,
                    height: 118,
                },
            };
        } else {
            // kingdom card
            preprocessOptions = {
                resize: {
                    width: 300,
                    height: 215,
                },
            };
        }
        await image.preprocess(preprocessOptions);

        const encoderOptions = { mozjpeg: {} }; // means default options
        await image.encode<EncoderOptions>(encoderOptions);

        return (await image.encodedWith.mozjpeg)?.binary ?? new Uint8Array();
    }
}
