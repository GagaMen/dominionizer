module.exports = {
    root: true,
    overrides: [
        {
            files: ['*.ts'],
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:@angular-eslint/recommended',
                'plugin:prettier/recommended',
                'prettier/@typescript-eslint',
            ],
            rules: {
                '@angular-eslint/component-selector': [
                    'error',
                    { type: 'element', prefix: 'app', style: 'kebab-case' },
                ],
                '@angular-eslint/directive-selector': [
                    'error',
                    { type: 'attribute', prefix: 'app', style: 'camelCase' },
                ],
                '@typescript-eslint/no-floating-promises': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/unbound-method': [
                    'error',
                    {
                        ignoreStatic: true,
                    },
                ],
            },
        },
        {
            files: ['*.js'],
            extends: ['eslint:recommended', 'plugin:prettier/recommended'],
            parserOptions: {
                ecmaVersion: 2020,
            },
            env: {
                node: true,
            },
        },
        {
            files: ['*.json'],
            extends: ['plugin:json/recommended-with-comments'],
        },
        {
            files: ['*.component.html'],
            extends: ['plugin:@angular-eslint/template/recommended', 'plugin:prettier/recommended'],
        },
    ],
};
