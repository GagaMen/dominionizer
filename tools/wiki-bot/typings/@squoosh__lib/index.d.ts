/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

declare module '@squoosh/lib' {
    export interface ResizeOptions {
        width: number;
        height: number;
        method: 'triangle' | 'catrom' | 'mitchell' | 'lanczos3';
        premultiply: boolean;
        linearRGB: boolean;
    }

    export interface QuantOptions {
        numColors: number;
        dither: number;
    }

    export interface RotateOptions {
        numRotations: number;
    }

    type PreprocessOptions = {
        resize?: Partial<Omit<ResizeOptions, 'width' | 'height'>> &
            (Pick<ResizeOptions, 'width'> | Pick<ResizeOptions, 'height'>);
        quant?: Partial<QuantOptions>;
        rotate?: Partial<RotateOptions>;
    };

    type EncodeResult = {
        optionsUsed: object;
        binary: Uint8Array;
        extension: string;
        size: number;
    };

    const enum MozJpegColorSpace {
        GRAYSCALE = 1,
        RGB,
        YCbCr,
    }

    interface MozJPEGEncodeOptions {
        quality: number;
        baseline: boolean;
        arithmetic: boolean;
        progressive: boolean;
        optimize_coding: boolean;
        smoothing: number;
        color_space: MozJpegColorSpace;
        quant_table: number;
        trellis_multipass: boolean;
        trellis_opt_zero: boolean;
        trellis_opt_table: boolean;
        trellis_loops: number;
        auto_subsample: boolean;
        chroma_subsample: number;
        separate_chroma_quality: boolean;
        chroma_quality: number;
    }

    interface WebPEncodeOptions {
        quality: number;
        target_size: number;
        target_PSNR: number;
        method: number;
        sns_strength: number;
        filter_strength: number;
        filter_sharpness: number;
        filter_type: number;
        partitions: number;
        segments: number;
        pass: number;
        show_compressed: number;
        preprocessing: number;
        autofilter: number;
        partition_limit: number;
        alpha_compression: number;
        alpha_filtering: number;
        alpha_quality: number;
        lossless: number;
        exact: number;
        image_hint: number;
        emulate_jpeg_size: number;
        thread_level: number;
        low_memory: number;
        near_lossless: number;
        use_delta_palette: number;
        use_sharp_yuv: number;
    }

    enum AVIFTune {
        auto,
        psnr,
        ssim,
    }

    interface AvifEncodeOptions {
        cqLevel: number;
        denoiseLevel: number;
        cqAlphaLevel: number;
        tileRowsLog2: number;
        tileColsLog2: number;
        speed: number;
        subsample: number;
        chromaDeltaQ: boolean;
        sharpness: number;
        tune: AVIFTune;
    }

    interface JxlEncodeOptions {
        effort: number;
        quality: number;
        progressive: boolean;
        epf: number;
        lossyPalette: boolean;
        decodingSpeedTier: number;
        photonNoiseIso: number;
        lossyModular: boolean;
    }

    enum UVMode {
        UVModeAdapt = 0, // Mix of 420 and 444 (per block)
        UVMode420, // All blocks 420
        UVMode444, // All blocks 444
        UVModeAuto, // Choose any of the above automatically
    }

    enum Csp {
        kYCoCg,
        kYCbCr,
        kCustom,
        kYIQ,
    }

    interface WP2EncodeOptions {
        quality: number;
        alpha_quality: number;
        effort: number;
        pass: number;
        sns: number;
        uv_mode: UVMode;
        csp_type: Csp;
        error_diffusion: number;
        use_random_matrix: boolean;
    }

    interface OxiPngEncodeOptions {
        level: number;
    }

    type EncoderOptions = {
        mozjpeg?: Partial<MozJPEGEncodeOptions>;
        webp?: Partial<WebPEncodeOptions>;
        avif?: Partial<AvifEncodeOptions>;
        jxl?: Partial<JxlEncodeOptions>;
        wp2?: Partial<WP2EncodeOptions>;
        oxipng?: Partial<OxiPngEncodeOptions>;
    };

    /**
     * A pool where images can be ingested and squooshed.
     */
    export class ImagePool {
        /**
         * Create a new pool.
         * @param {number} [threads] - Number of concurrent image processes to run in the pool. Defaults to the number of CPU cores in the system.
         */
        constructor(threads?: number);

        /**
         * Ingest an image into the image pool.
         * @param {string | Buffer | URL | object} image - The image or path to the image that should be ingested and decoded.
         * @returns {Image} - A custom class reference to the decoded image.
         */
        ingestImage(image: string | Buffer | URL | object): Image;

        /**
         * Closes the underlying image processing pipeline. The already processed images will still be there, but no new processing can start.
         * @returns {Promise<undefined>} - A promise that resolves when the underlying pipeline has closed.
         */
        close(): Promise<undefined>;
    }

    /**
     * Represents an ingested image.
     */
    export class Image {
        constructor(workerPool: any, file: any);
        file: any;
        workerPool: any;
        decoded: any;
        encodedWith: object;

        /**
         * Define one or several preprocessors to use on the image.
         * @param {object} preprocessOptions - An object with preprocessors to use, and their settings.
         * @returns {Promise<undefined>} - A promise that resolves when all preprocessors have completed their work.
         */
        preprocess(preprocessOptions: PreprocessOptions): Promise<undefined>;

        /**
         * Define one or several encoders to use on the image.
         * @param {object} encodeOptions - An object with encoders to use, and their settings.
         * @returns {Promise<undefined>} - A promise that resolves when the image has been encoded with all the specified encoders.
         */
        encode<T extends EncoderOptions>(
            encodeOptions?: {
                optimizerButteraugliTarget?: number;
                maxOptimizerRounds?: number;
            } & T,
        ): Promise<{ [key in keyof T]: EncodeResult }>;
    }
}
