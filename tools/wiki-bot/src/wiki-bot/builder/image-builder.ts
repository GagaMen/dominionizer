import { ImagePage } from '../wiki-client/api-models';
import { WikiClient } from '../wiki-client/wiki-client';
import { SharpFactory } from './sharp-factory';

export interface EncodedImage {
    id: number;
    fileName: string;
    data: Uint8Array;
}

export class ImageBuilder {
    constructor(
        private wikiClient: WikiClient,
        private sharpFactory: SharpFactory,
    ) {}

    async build(imagePage: ImagePage): Promise<EncodedImage | null> {
        try {
            return {
                id: imagePage.pageid,
                fileName: this.buildFileName(imagePage),
                data: await this.buildData(imagePage),
            };
        } catch (error) {
            let errorMessage = '';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            console.error(`Building image '${imagePage.title}' failed. Error: ${errorMessage}`);

            return null;
        }
    }

    private buildFileName(imagePage: ImagePage): string {
        return imagePage.title.replace('File:', '').replace('(expansion) ', '').replace(/\s/g, '_');
    }

    private async buildData(imagePage: ImagePage): Promise<Uint8Array> {
        const imageinfo = imagePage.imageinfo[0];
        const rawImage = await this.wikiClient.fetchImage(imageinfo.url);

        return imageinfo.mime === 'image/png'
            ? await this.buildDataForCardSymbol(rawImage)
            : await this.buildDataForCardArt(rawImage);
    }

    private async buildDataForCardSymbol(rawImage: Buffer): Promise<Uint8Array> {
        const optimizedImage = await this.sharpFactory
            .create(rawImage)
            .resize({ height: 40 })
            .png()
            .timeout({ seconds: 15 })
            .toBuffer();

        return new Uint8Array(optimizedImage);
    }

    private async buildDataForCardArt(rawImage: Buffer): Promise<Uint8Array> {
        const sharpInstance = this.sharpFactory.create(rawImage);
        const imageMetadata = await sharpInstance.metadata();

        if (imageMetadata.width === undefined || imageMetadata.height === undefined) {
            throw new Error('Width or height of image could not be determined.');
        }

        const aspectRatio: number = imageMetadata.width / imageMetadata.height;

        let resizeWidth: number;
        if (aspectRatio < 1) {
            // supply card
            resizeWidth = 150;
        } else {
            // kingdom card or special card
            resizeWidth = 300;
        }

        const optimizedImage = await sharpInstance
            .resize({ width: resizeWidth })
            .jpeg({ mozjpeg: true })
            .timeout({ seconds: 15 })
            .toBuffer();

        return new Uint8Array(optimizedImage);
    }
}
