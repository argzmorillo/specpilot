// @ts-check
import baseConfig from '../eslint/base.js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  ...baseConfig,

  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      'no-throw-literal': 'error',
      'no-return-await': 'off',
    },
  },
  eslintConfigPrettier,
];
