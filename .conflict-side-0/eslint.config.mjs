/**
 * Debugging:
 *   https://eslint.org/docs/latest/use/configure/debug
 *  ----------------------------------------------------
 *
 *   Print a file's calculated configuration
 *
 *     bunx eslint --print-config path/to/file.js
 *
 *   Inspecting the config
 *
 *     bunx eslint --inspect-config
 *
 */
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import eslintConfigEmberBase from 'eslint-plugin-ember/configs/base';
import eslintConfigEmberRecommended from 'eslint-plugin-ember/configs/recommended';
import eslintConfigEmberGJS from 'eslint-plugin-ember/configs/recommended-gjs';
import eslintConfigEmberGTS from 'eslint-plugin-ember/configs/recommended-gts';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginQunitRecommended from 'eslint-plugin-qunit/configs/recommended';
import n from 'eslint-plugin-n';
import babelParser from '@babel/eslint-parser';
import importPlugin from 'eslint-plugin-import';

const esmParserOptions = {
  ecmaFeatures: { modules: true },
  ecmaVersion: 'latest',
  requireConfigFile: false,
  babelOptions: {
    plugins: [['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }]],
  },
};

export default defineConfig([
  /**
   * Global plugins & configs
   */
  {
    name: 'Global plugins & configs',
    extends: [
      js.configs.recommended,
      stylistic.configs.recommended,

      eslintConfigPrettier,

      eslintConfigEmberBase,
      eslintConfigEmberRecommended,
      eslintConfigEmberGJS,

      importPlugin.flatConfigs.recommended,
    ],
  },

  /**
   * Ignores must be in their own object
   * https://eslint.org/docs/latest/use/configure/ignore
   */
  {
    name: 'Ignore files',
    ignores: ['dist/', 'node_modules/', 'coverage/', '!**/.*'],
  },

  /**
   * https://eslint.org/docs/latest/use/configure/configuration-files#configuring-linter-options
   */
  {
    name: 'Linter options',
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },

  /**
   * Override default rules
   */
  {
    name: 'Override default rules',
    rules: {
      'import/order': [
        'error',
        {
          groups: [],
          'newlines-between': 'never',
          // alphabetize: {
          //   order: 'asc',
          // },
        },
      ],
      'import/no-unresolved': 'off',

      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'multiline-block-like' },
        { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
      ],
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],

      'ember/no-array-prototype-extensions': 'error', // Prototype extensions are deprecated since Ember 5.10
      'ember/no-empty-glimmer-component-classes': 'off', // It's useful to have empty components since the names are shown in devtools
      'ember/no-runloop': 'off', // Run-loop isn't deprecated yet. Switching to ember-concurrency would require a lot of effort. We can use ember-lifeline as a drop-in replacement whenever run-loop becomes deprecated.
      'ember/no-at-ember-render-modifiers': 'off', // We use `did-insert` & `did-update` render modifiers a lot
      'ember/no-builtin-form-components': 'off', // We use `Textarea` & `Input` components a lot
    },
  },

  /**
   * JavaScript files
   */
  {
    name: 'JavaScript parser',
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
    },
  },
  {
    name: 'JavaScript files',
    files: ['**/*.{js,gjs}'],
    languageOptions: {
      parserOptions: esmParserOptions,
      globals: {
        ...globals.browser,
      },
    },
  },

  /**
   * TypeScript files
   */
  {
    name: 'TypeScript files',
    files: ['**/*.{ts,gts}'],
    extends: [tseslint.configs.recommended, eslintConfigEmberGTS, importPlugin.flatConfigs.typescript],
    rules: {
      'no-constant-condition': ['error', { checkLoops: false }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {
            memberTypes: ['constructor', 'get', 'set', 'method'],
            order: 'alphabetically',
          },
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },

  /**
   * Test files
   */
  {
    name: 'Test files',
    files: ['tests/**/*-test.{js,gjs,ts,gts}'],
    extends: [eslintPluginQunitRecommended],
    rules: {
      'qunit/no-commented-tests': 'error',
      'qunit/require-expect': 'off',
      'ember/no-replace-test-comments': 'error',
    },
  },

  /**
   * CJS node files
   */
  {
    name: 'CSJ node files',
    files: [
      '**/*.cjs',
      'config/**/*.js',
      'tests/dummy/config/**/*.js',
      'testem.js',
      'testem*.js',
      'index.js',
      '.prettierrc.js',
      '.stylelintrc.js',
      '.template-lintrc.js',
      'ember-cli-build.js',
      'lib/custom-file-plugin.js',
      'lib/default-meta-tags/index.js',
    ],
    plugins: {
      n,
    },

    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
  },

  /**
   * ESM node files
   */
  {
    name: 'ESM node files',
    files: ['**/*.mjs'],
    plugins: {
      n,
    },

    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: esmParserOptions,
      globals: {
        ...globals.node,
      },
    },
  },
]);
