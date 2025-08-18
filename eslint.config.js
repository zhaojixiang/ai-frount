import eslint from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default [
  // 0. 基础配置
  {
    ignores: ['dist', 'node_modules', '*.d.ts']
  },

  // 1. 核心规则
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,

  // 2. 全局规则
  {
    languageOptions: {
      globals: {
        ...globals.browser, // 确保所有 JS 文件都能识别 window
        ...globals.node
      }
    },
    rules: {
      'no-unsafe-optional-chaining': 'error',
      'no-prototype-builtins': 'error',
      'import/no-default-export': 'off' // 根据项目需要调整
    }
  },
  // 3. React 配置
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react-refresh/only-export-components': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-target-blank': 'error' // 新增安全规则
    }
  },

  // 4. TypeScript 增强
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error', // 升级为error
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      // '@typescript-eslint/consistent-type-definitions': ['error'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: false
        }
      ]
    }
  },

  // 5. Vite 环境支持
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.ts'],
        ecmaVersion: 'latest'
      }
    },
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'import.meta',
          message: 'Always use explicit `import.meta.env`'
        }
      ]
    }
  },

  // 6. 导入规范
  {
    plugins: { import: eslintPluginImport },
    settings: {
      // support import modules from TypeScript files in JavaScript files
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx']
        }
      },
      'import/extensions': ['.js', '.mjs', '.jsx'],
      'import/external-module-folders': ['node_modules']
    },
    rules: {
      'react/jsx-no-bind': 'off',
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/no-unstable-nested-components': 0,
      'react/display-name': 0,
      'react/jsx-props-no-spreading': 0,
      'react/state-in-constructor': 0,
      'react/static-property-placement': 0,
      // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
      'react/destructuring-assignment': 'off',
      'react/jsx-filename-extension': 'off',
      'react/no-array-index-key': 'warn',
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'off',
      'react/require-default-props': 0,
      'react/jsx-fragments': 0,
      'react/jsx-wrap-multilines': 0,
      'react/prop-types': 0,
      'react/forbid-prop-types': 0,
      'react/sort-comp': 0,
      'react/react-in-jsx-scope': 0,
      'react/jsx-one-expression-per-line': 0,
      'react/jsx-boolean-value': ['off', 'never'],
      'react/jsx-curly-brace-presence': ['off', 'never'],
      'react/jsx-curly-newline': ['off', 'never'],
      'react/jsx-closing-bracket-location': ['off', 'never'],
      'generator-star-spacing': 0,
      'function-paren-newline': 0,
      'import/no-unresolved': 0,
      'import/order': 0,
      'import/no-named-as-default': 0,
      'import/no-cycle': 0,
      'import/prefer-default-export': 0,
      'import/no-default-export': 0,
      'import/no-extraneous-dependencies': 0,
      'import/named': 0,
      'import/no-named-as-default-member': 0,
      'import/no-duplicates': 0,
      'import/no-self-import': 0,
      'import/extensions': 0,
      'import/no-useless-path-segments': 0,
      'jsx-a11y/no-noninteractive-element-interactions': 0,
      'jsx-a11y/click-events-have-key-events': 0,
      'jsx-a11y/no-static-element-interactions': 0,
      'jsx-a11y/anchor-is-valid': 0,
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/alt-text': 'off',
      'jsx-a11y/control-has-associated-label': [0],
      'sort-imports': 0,
      'class-methods-use-this': 0,
      'no-confusing-arrow': 0,
      'linebreak-style': 0,
      // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
      'no-prototype-builtins': 'off',
      'unicorn/prevent-abbreviations': 'off',
      // Conflict with prettier
      'arrow-body-style': 0,
      'arrow-parens': 0,
      'object-curly-newline': 0,
      'implicit-arrow-linebreak': 0,
      'operator-linebreak': 0,
      'eslint-comments/no-unlimited-disable': 0,
      'no-param-reassign': 2,
      'space-before-function-paren': 0,
      'react/self-closing-comp': 1,
      'no-restricted-syntax': 0,
      'react/function-component-definition': 0,
      'jsx-quotes': 0,
      'react/no-unknown-property': 0
    }
  },

  // 7. Prettier 集成（保持最后）
  pluginPrettier
];
