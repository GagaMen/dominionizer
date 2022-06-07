import { ImagePool, EncoderOptions, EncodeResult, PreprocessOptions } from '@squoosh/lib';

export class ImageBuilder {
    constructor(private imagePool: ImagePool) {}

    async build(
        rawImage: Buffer,
        preprocessOptions: PreprocessOptions,
        encodeOptions: EncoderOptions,
    ): Promise<{ [key in keyof EncoderOptions]: EncodeResult }> {
        const image = this.imagePool.ingestImage(rawImage);

        await image.preprocess(preprocessOptions);

        return await image.encode<EncoderOptions>(encodeOptions);
    }
}
