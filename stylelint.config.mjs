export default {
    extends: ['stylelint-config-standard-scss', 'stylelint-prettier/recommended'],
    rules: {
        'selector-pseudo-element-no-unknown': [
            true,
            {
                ignorePseudoElements: ['ng-deep'],
            },
        ],
    },
};
