const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin');

module.exports = {
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    context: 'src/assets/',
                    from: '**/*',
                    to: 'assets/',
                    globOptions: {
                        ignore: ['**/card_art/**', '**/card_symbols/**'],
                    },
                },
            ],
        }),
    ],
    optimization: {
        minimizer: [
            new JsonMinimizerPlugin(),
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
