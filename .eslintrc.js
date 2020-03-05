module.exports = {
    root: true,
    parser:  '@typescript-eslint/parser',
    extends:  [
        'plugin:@typescript-eslint/recommended',
        'plugin:json/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    parserOptions:  {
        ecmaVersion:  2018,
        sourceType:  'module',
    },
};
