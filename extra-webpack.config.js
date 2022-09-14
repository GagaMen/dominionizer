const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
    optimization: {
        minimizer: [
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            'optipng',
                            [
                                'svgo',
                                {
                                    plugins: [
                                        'preset-default',
                                        'convertStyleToAttrs',
                                        {
                                            name: 'removeAttrs',
                                            params: {
                                                attrs: [
                                                    '^(g|path)$:^(?!id|d|fill|stroke|stroke-linejoin|stroke-width|opacity)(.*)$',
                                                ],
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],
    },
};
