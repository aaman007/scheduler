module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  ignorePatterns: [],
  rules: {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "no-unused-vars": ["off"],
    "no-console": ["off"],
    "func-names": ["off"],
    "prefer-template": ["off"],
    "prefer-arrow-callback": ["off"],
    "space-before-blocks": ["off"],
    "no-shadow": ["off"],
    "indent": ["error", 4]
  },
};
