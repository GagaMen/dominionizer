module.exports = {
    root: true,
    overrides: [
        {
            files: ['*.ts'],
            plugins: ['@angular-eslint'],
            extends:  [
                'eslint:recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:prettier/recommended',
                'prettier/@typescript-eslint',
            ],
            parserOptions:  {
                ecmaVersion:  2018,
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
            // TODO: check which rules already defined by @typescript-eslint/recommended and prettier/recommended
            rules: {
                // ORIGINAL tslint.json -> "array-type": false,
                '@typescript-eslint/array-type': 'off',

                // ORIGINAL tslint.json -> "arrow-parens": false,
                'arrow-parens': 'off',

                // ORIGINAL tslint.json -> "component-class-suffix": true,
                '@angular-eslint/component-class-suffix': 'error',

                // ORIGINAL tslint.json -> "contextual-lifecycle": true,
                '@angular-eslint/contextual-lifecycle': 'error',

                // ORIGINAL tslint.json -> "directive-class-suffix": true,
                // TODO: comment out if implemented by project @angular-eslint/angular-eslint
                // '@angular-eslint/directive-class-suffix': 'error'

                // ORIGINAL tslint.json -> "directive-selector": [true, "attribute", "app", "camelCase"],
                "@angular-eslint/directive-selector": [
                    'error',
                    { type: 'attribute', prefix: 'app', style: 'camelCase' }
                ],

                // ORIGINAL tslint.json -> "component-selector": [true, "element", "app", "kebab-case"],
                "@angular-eslint/component-selector": [
                    'error',
                    { type: 'element', prefix: 'app', style: 'kebab-case' }
                ],

                // ORIGINAL tslint.json -> "import-blacklist": [true, "rxjs/Rx"],
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

                // ORIGINAL tslint.json -> "interface-name": false,
                '@typescript-eslint/interface-name-prefix': 'off',

                // ORIGINAL tslint.json -> "max-classes-per-file": false,
                'max-classes-per-file': 'off',

                // ORIGINAL tslint.json -> "max-line-length": [true, 140],
                'max-len': ['error', { code: 140 }],

                // ORIGINAL tslint.json -> "member-access": false,
                '@typescript-eslint/explicit-member-accessibility': 'off',

                // ORIGINAL tslint.json -> "member-ordering": [true, { "order": ["static-field", "instance-field", "static-method", "instance-method"] } ],
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

                // ORIGINAL tslint.json -> "no-consecutive-blank-lines": false,
                'no-multiple-empty-lines': 'off',

                // ORIGINAL tslint.json -> "no-console": [true, "debug", "info", "time", "timeEnd", "trace"],
                'no-restricted-syntax': [
                    'error',
                    {
                        selector:
                        'CallExpression[callee.object.name="console"][callee.property.name=/^(debug|info|time|timeEnd|trace)$/]',
                        message: 'Unexpected property on console object was called',
                    },
                ],

                // ORIGINAL tslint.json -> "no-empty": false,
                'no-empty': 'off',

                // ORIGINAL tslint.json -> "no-inferrable-types": [true, "ignore-params"],
                '@typescript-eslint/no-inferrable-types': [
                    'error',
                    {
                        ignoreParameters: true,
                    },
                ],

                // ORIGINAL tslint.json -> "no-non-null-assertion": true,
                '@typescript-eslint/no-non-null-assertion': 'error',

                // ORIGINAL tslint.json -> "no-switch-case-fall-through": true,
                'no-fallthrough': 'error',

                // ORIGINAL tslint.json -> "no-var-requires": false,
                '@typescript-eslint/no-var-requires': 'off',

                // ORIGINAL tslint.json -> "object-literal-key-quotes": [true, "as-needed"],
                'quote-props': ['error', 'as-needed'],

                // ORIGINAL tslint.json -> "object-literal-sort-keys": false,
                'sort-keys': 'off',

                // ORIGINAL tslint.json -> "quotemark": [true, "single"],
                quotes: ['error', 'single'],

                // ORIGINAL tslint.json -> "trailing-comma": false,
                'comma-dangle': 'off',

                // ORIGINAL tslint.json -> "no-conflicting-lifecycle": true,
                "@angular-eslint/no-conflicting-lifecycle": 'error',

                // ORIGINAL tslint.json -> "no-host-metadata-property": true,
                '@angular-eslint/no-host-metadata-property': 'error',

                // ORIGINAL tslint.json -> "no-input-rename": true,
                '@angular-eslint/no-input-rename': 'error',

                // ORIGINAL tslint.json -> "no-inputs-metadata-property": true,
                '@angular-eslint/no-inputs-metadata-property': 'error',

                // ORIGINAL tslint.json -> "no-output-native": true,
                '@angular-eslint/no-output-native': 'error',

                // ORIGINAL tslint.json -> "no-output-on-prefix": true,
                '@angular-eslint/no-output-on-prefix': 'error',

                // ORIGINAL tslint.json -> "no-output-rename": true,
                '@angular-eslint/no-output-rename': 'error',

                // ORIGINAL tslint.json -> "no-outputs-metadata-property": true,
                '@angular-eslint/no-outputs-metadata-property': 'error',

                // ORIGINAL tslint.json -> "use-lifecycle-interface": true,
                '@angular-eslint/use-lifecycle-interface': 'warn',

                // ORIGINAL tslint.json -> "use-pipe-transform-interface": true
                '@angular-eslint/use-pipe-transform-interface': 'error',
            }
        },
        {
            files: ['*.js'],
            extends:  [
                'eslint:recommended',
                'plugin:prettier/recommended',
            ],
            parserOptions:  {
                ecmaVersion:  2018,
            },
        },
        {
            files: ['*.json'],
            extends: ["plugin:json/recommended"]
        },
        {
            files: ['*.component.html'],
            parser: '@angular-eslint/template-parser',
            plugins: ['@angular-eslint/template'],
            extends: ['plugin:prettier/recommended'],
            rules: {
                // ORIGINAL tslint.json -> "template-banana-in-box": true,
                '@angular-eslint/template/banana-in-a-box': 'error',

                // ORIGINAL tslint.json -> "template-no-negated-async": true,
                '@angular-eslint/template/no-negated-async': 'error',
            }
        }
    ]
};
