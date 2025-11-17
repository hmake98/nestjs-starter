module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Override header max length to be more reasonable (default is 100)
    'header-max-length': [2, 'always', 100],

    // Allow lowercase and sentence-case for subject
    'subject-case': [
      2,
      'never',
      ['start-case', 'pascal-case', 'upper-case'],
    ],
  },
};
