// eslint.config.js
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default [
  // JS 基础规则
  js.configs.recommended,

  // TypeScript 基础规则
  ...tseslint.configs.recommended,

  // React 规则
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react: reactPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      'react/jsx-indent': 'off',
      'react/no-array-index-key': 'off',
      'react/no-unknown-property': 'off',
      'react/no-danger': 'off',
      'react/sort-comp': 'off',
      'react/self-closing-comp': 'error',
      'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }]
    }
  },

  // TS 增强规则
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        project: './tsconfig.eslint.json',
        ecmaFeatures: { jsx: true }
      }
    },
    // ignores: ['**/*.d.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      'object-shorthand': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',
      '@typescript-eslint/no-dupe-class-members': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-invalid-this': 'error',
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      // '@typescript-eslint/no-throw-literal': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      // '@typescript-eslint/type-annotation-spacing': 'error',
      '@typescript-eslint/typedef': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/no-explicit-any': 0,
      'no-nested-ternary': 'error',
      'consistent-return': 'error',
      'no-param-reassign': [
        'error',
        {
          props: true // 🚨 禁止修改参数的属性
        }
      ],
      'import/newline-after-import': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true }
      ],
      // 你需要的 import 规则
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: true
        }
      ]
    }
  },

  // Import 规则 & Prettier
  {
    plugins: {
      import: importPlugin,
      prettier,
      'simple-import-sort': simpleImportSort
    },
    rules: {
      'import/first': 'error',
      'import/no-unresolved': [
        2,
        {
          ignore: ['^@/', '^@@/']
        }
      ],
      'prettier/prettier': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
          paths: ['.']
        }
      }
    }
  }
];
