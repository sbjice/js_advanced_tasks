module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: [
    'prettier',
    'jest',
  ],
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-var': 'error',
  },
};
