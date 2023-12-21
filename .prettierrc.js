'use strict';

module.exports = {
  printWidth: 150,
  singleQuote: true,
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      files: '*.hbs',
      options: {
        singleQuote: false,
      },
    },
  ],
};
