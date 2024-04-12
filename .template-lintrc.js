'use strict';

module.exports = {
  // https://github.com/ember-template-lint/ember-template-lint-plugin-prettier/issues/268
  // plugins: ['ember-template-lint-plugin-prettier'],
  extends: [
    'recommended',
    // https://github.com/ember-template-lint/ember-template-lint-plugin-prettier/issues/268
    // 'ember-template-lint-plugin-prettier:recommended'
  ],

  rules: {
    'require-presentational-children': 'off',
    'no-invalid-link-text': 'off',
  },
};
