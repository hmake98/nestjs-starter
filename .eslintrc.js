module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  env: {
    "browser": true,
    "es6": true,
    "node": true
  },
  overrides: [
    {
      "files": ["*.tsx"],
      "rules": {
        "react/prop-types": "off"
      }
    },
    {
      "files": ["*.js"],
      "rules": {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ]
}