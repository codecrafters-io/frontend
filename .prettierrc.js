'use strict';

module.exports = {
  printWidth: 150,
  singleQuote: true,
  overrides: [
    {
      files: '*.hbs',
      options: {
        singleQuote: false,
      },
    },
  ],
};
