'use strict';

module.exports = {
  plugins: ['ember-template-lint-plugin-prettier'],
  extends: ['recommended', 'ember-template-lint-plugin-prettier:recommended'],

  rules: {
    'require-presentational-children': 'off',
    'no-invalid-link-text': 'off',
  },
};
