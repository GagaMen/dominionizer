const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
    plugins: [
        new ImageMinimizerPlugin({
            minimizerOptions: {
                plugins: [
                    'optipng',
                    [
                        'svgo',
                        {
                            plugins: [
                                {
                                    removeAttrs: {
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
        }),
    ],
};
