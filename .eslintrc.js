'use strict';

// Disable until https://github.com/ember-template-lint/ember-template-lint-plugin-prettier/issues/268 is resolved
// require('eslint-plugin-ember-template-lint/lib/ember-teplate-lint/config').registerPlugin('ember-template-lint-plugin-prettier');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      plugins: [['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }]],
    },
  },
  plugins: ['ember', '@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:ember/recommended', 'plugin:prettier/recommended', 'plugin:import/recommended', 'plugin:import/typescript'],
  env: {
    browser: true,
  },
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
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'multiline-block-like' },
      { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
    ],
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],

    'ember/no-array-prototype-extensions': 'error', // Prototype extensions are deprecated since Ember 5.10
    'ember/no-empty-glimmer-component-classes': 'off', // It's useful to have empty components since the names are shown in devtools
    'ember/no-runloop': 'off', // Run-loop isn't deprecated yet. Switching to ember-concurrency would require a lot of effort. We can use ember-lifeline as a drop-in replacement whenever run-loop becomes deprecated.
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: {
          memberTypes: ['constructor', 'get', 'set', 'method'],
          order: 'alphabetically',
        },
      },
    ],
  },
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.stylelintrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './lib/*/index.js',
        './server/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      extends: ['plugin:n/recommended'],
    },
    {
      // test files
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
      rules: {
        'qunit/no-commented-tests': 'off',
      },
    },
    // TypeScript files
    {
      files: ['**/*.ts'],
      extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/eslint-recommended'],
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-unused-vars': 'off', // We use @typescript-eslint/no-unused-vars instead
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-constant-condition': ['error', { checkLoops: false }],
      },
    },
    // GTS files
    {
      files: ['**/*.gts'],
      parser: 'ember-eslint-parser',
      plugins: ['ember'],
      extends: ['plugin:@typescript-eslint/recommended', 'plugin:ember/recommended-gts'],
    },
  ],
};
