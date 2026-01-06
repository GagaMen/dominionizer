import unusedImports from 'eslint-plugin-unused-imports';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import angular from 'angular-eslint';
import json from '@eslint/json';
import globals from 'globals';

const modulePath = import.meta.dirname;

export default defineConfig(
    eslintPluginPrettierRecommended,
    includeIgnoreFile(path.resolve(modulePath, '.gitignore')),
    {
        files: ['**/*.ts'],
        plugins: {
            'unused-imports': unusedImports,
        },
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.stylistic,
            ...angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates,
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: modulePath,
                project: ['tsconfig.json', './tools/*/tsconfig.json'],
            },
        },
        rules: {
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case',
                },
            ],

            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],

            '@typescript-eslint/unbound-method': [
                'error',
                {
                    ignoreStatic: true,
                },
            ],

            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
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
        files: ['**/*.spec.ts'],
        rules: {
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
        },
    },
    {
        files: ['**/*.js'],
        plugins: {
            'unused-imports': unusedImports,
        },
        extends: [eslint.configs.recommended],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ['**/*.component.html'],
        extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    },
    {
        files: ['**/*.json'],
        ignores: ['package-lock.json'],
        plugins: {
            json,
        },
        language: 'json/jsonc',
        extends: ['json/recommended'],
    },
);
