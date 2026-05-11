import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import jestPlugin from 'eslint-plugin-jest';
import promisePlugin from 'eslint-plugin-promise';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
    {
        ignores: [
            'dist/**',
            'coverage/**',
            'node_modules/**',
            '.husky/**',
            '.github/**',
            'docs/**',
            'eslint.config.mjs',
            '**/*.js',
            '**/*.mjs',
        ],
    },

    // === Base JS + type-aware TS rules ===
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,

    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
            },
            globals: { ...globals.node, ...globals.jest },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        plugins: {
            'import-x': importPlugin,
            promise: promisePlugin,
            'unused-imports': unusedImportsPlugin,
        },
        settings: {
            'import-x/resolver': {
                typescript: { project: 'tsconfig.json' },
                node: true,
            },
        },
        rules: {
            // --- Forbid `any` outright; force callers to use `unknown` ---
            // --- and narrow, or pick a precise type. ---
            '@typescript-eslint/no-explicit-any': 'error',

            // --- Loosen unsafe-* family: NestJS code legitimately handles ---
            // --- decorator metadata, request bodies, etc. as unknown shapes ---
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-enum-comparison': 'off',

            // --- Real bug-finders worth keeping on ---
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': [
                'error',
                {
                    checksVoidReturn: {
                        arguments: false,
                        attributes: false,
                    },
                },
            ],
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/require-await': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/restrict-template-expressions': [
                'warn',
                {
                    allowNumber: true,
                    allowBoolean: true,
                    allowNullish: true,
                    allowAny: true,
                },
            ],
            '@typescript-eslint/no-base-to-string': 'warn',
            '@typescript-eslint/prefer-nullish-coalescing': 'warn',
            '@typescript-eslint/prefer-optional-chain': 'warn',

            // --- Consistency / style ---
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                {
                    prefer: 'type-imports',
                    fixStyle: 'inline-type-imports',
                },
            ],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'warn',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],

            // --- Import ordering (autofixed by eslint --fix) ---
            'import-x/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        ['parent', 'sibling', 'index'],
                    ],
                    pathGroups: [
                        {
                            pattern: 'src/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
            'import-x/no-duplicates': 'error',
            'import-x/newline-after-import': 'warn',
            'import-x/no-self-import': 'error',
            'import-x/no-cycle': 'warn',

            // --- Promise hygiene ---
            'promise/always-return': 'off',
            'promise/catch-or-return': 'off',
            'promise/no-return-wrap': 'error',
            'promise/no-nesting': 'warn',

            // --- Misc ---
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            eqeqeq: ['error', 'smart'],
        },
    },

    // === Test overrides ===
    {
        files: ['test/**/*.ts'],
        plugins: { jest: jestPlugin },
        rules: {
            ...jestPlugin.configs['flat/recommended'].rules,
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/require-await': 'off',
            'jest/expect-expect': 'off',
            'no-console': 'off',
        },
    },

    // === Disables formatting rules that conflict with Prettier ===
    prettierConfig,
];
