'use strict';

module.exports = {
  extends: ['recommended'],

  rules: {
    'require-presentational-children': 'off',
    'no-invalid-link-text': 'off',
    'no-at-ember-render-modifiers': 'off', // We use `did-insert` & `did-update` render modifiers a lot
    'no-builtin-form-components': 'off', // We use `Textarea` & `Input` components a lot
  },
};
