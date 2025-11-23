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
    {
      files: '*.{js,gjs,ts,gts,mjs,mts,cjs,cts}',
      options: {
        singleQuote: true,
        templateSingleQuote: false,
      },
    },
  ],
};
