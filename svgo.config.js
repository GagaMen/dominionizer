module.exports = {
    plugins: [
        'preset-default',
        'removeViewBox',
        'removeTitle',
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
};
