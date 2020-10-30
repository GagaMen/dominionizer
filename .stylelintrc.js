module.exports = {
    extends: ['stylelint-config-sass-guidelines', 'stylelint-prettier/recommended'],
    rules: {
        'selector-pseudo-element-no-unknown': [
            true,
            {
                ignorePseudoElements: ['ng-deep'],
            },
        ],
    },
};
