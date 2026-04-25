import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',

      eqeqeq: 'error',
      curly: 'error',

      'no-console': 'off',
    },
  },
];
