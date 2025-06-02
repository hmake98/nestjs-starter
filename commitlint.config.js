module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // New feature
                'fix', // Bug fix
                'docs', // Documentation
                'style', // Formatting, missing semi colons, etc; no code change
                'refactor', // Refactoring production code
                'test', // Adding tests, refactoring tests; no production code change
                'chore', // Updating build tasks, package manager configs, etc; no production code change
                'perf', // A code change that improves performance
                'revert', // Reverts a previous commit
                'ci', // Changes to our CI configuration files and scripts
                'build', // Changes that affect the build system or external dependencies
                'i18n', // Internationalization and localization
            ],
        ],
        'scope-enum': [
            2,
            'always',
            [
                'api',
                'frontend',
                'backend',
                'docs',
                'tests',
                'config',
                'chore',
                'build',
                'deps',
                'auth',
                'db',
                'ui',
                'perf',
                'security',
            ],
        ],
        'scope-empty': [2, 'never'], // Requires a scope to always be present
        'subject-case': [
            2,
            'always',
            ['sentence-case'], // Enforces sentence case for the subject
        ],
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 50], // Limits header to 50 characters for common readability
    },
};
