const configureKarmaWithDefault = require('../../karma.conf.js');

module.exports = function (config) {
    configureKarmaWithDefault(config);
    config.set({
        files: ['./src/**/*.ts'],
        exclude: ['./src/main.ts'],
        preprocessors: {
            '**/*.ts': 'karma-typescript',
        },
        frameworks: ['jasmine', 'karma-typescript'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-typescript'),
        ],
        reporters: ['progress', 'kjhtml'],
        port: 9877,
        karmaTypescriptConfig: {
            tsconfig: 'tsconfig.spec.json',
            stopOnFailure: false,
            reports: {
                html: '',
                lcovonly: '',
                'text-summary': '',
            },
        },
    });
};
