module.exports = {
    root: true,
    overrides: [
        {
            files: ['*.ts'],
            plugins: ['unused-imports'],
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:@angular-eslint/recommended',
                'plugin:prettier/recommended',
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
                '@typescript-eslint/no-unused-vars': 'off',
                'unused-imports/no-unused-imports-ts': 'error',
                'unused-imports/no-unused-vars-ts': [
                    'warn',
                    {
                        vars: 'all',
                        varsIgnorePattern: '^_',
                        args: 'after-used',
                        argsIgnorePattern: '^_',
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
