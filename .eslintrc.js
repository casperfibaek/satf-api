module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-continue': 0,
    'no-console': 0,
    'import/extensions': 0,
    'max-len': 0,
    'no-underscore-dangle': 0,
    camelcase: 0,
  },
};
