module.exports = {
    root: true,
    overrides: [
        {
            files: ['*.ts'],
            plugins: ['@angular-eslint'],
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:prettier/recommended',
                'prettier/@typescript-eslint',
            ],
            parserOptions: {
                ecmaVersion: 2018,
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
            rules: {
                '@angular-eslint/component-class-suffix': 'error',
                '@angular-eslint/component-selector': [
                    'error',
                    { type: 'element', prefix: 'app', style: 'kebab-case' },
                ],
                '@angular-eslint/contextual-lifecycle': 'error',
                // '@angular-eslint/directive-class-suffix': 'error',
                '@angular-eslint/directive-selector': [
                    'error',
                    { type: 'attribute', prefix: 'app', style: 'camelCase' },
                ],
                '@typescript-eslint/interface-name-prefix': 'off',
                '@typescript-eslint/member-ordering': [
                    'error',
                    {
                        default: [
                            'static-field',
                            'instance-field',
                            'static-method',
                            'instance-method',
                        ],
                    },
                ],
                '@angular-eslint/no-conflicting-lifecycle': 'error',
                '@angular-eslint/no-host-metadata-property': 'error',
                '@angular-eslint/no-input-rename': 'error',
                '@angular-eslint/no-inputs-metadata-property': 'error',
                '@angular-eslint/no-output-native': 'error',
                '@angular-eslint/no-output-on-prefix': 'error',
                '@angular-eslint/no-output-rename': 'error',
                '@angular-eslint/no-outputs-metadata-property': 'error',
                'no-restricted-imports': [
                    'error',
                    {
                        paths: [
                            {
                                name: 'rxjs/Rx',
                                message: "Please import directly from 'rxjs' instead",
                            },
                        ],
                    },
                ],
                'no-restricted-syntax': [
                    'error',
                    {
                        selector:
                            'CallExpression[callee.object.name="console"][callee.property.name=/^(debug|info|time|timeEnd|trace)$/]',
                        message: 'Unexpected property on console object was called',
                    },
                ],
                '@typescript-eslint/unbound-method': [
                    'error',
                    {
                        ignoreStatic: true,
                    },
                ],
                '@angular-eslint/use-lifecycle-interface': 'warn',
                '@angular-eslint/use-pipe-transform-interface': 'error',
            },
        },
        {
            files: ['*.js'],
            extends: ['eslint:recommended', 'plugin:prettier/recommended'],
            parserOptions: {
                ecmaVersion: 2018,
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
            parser: '@angular-eslint/template-parser',
            plugins: ['@angular-eslint/template'],
            extends: ['plugin:prettier/recommended'],
            rules: {
                '@angular-eslint/template/banana-in-a-box': 'error',
                '@angular-eslint/template/no-negated-async': 'error',
            },
        },
    ],
};
