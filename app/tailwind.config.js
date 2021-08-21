/*global module*/
/*global require*/

const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      // Build your palette here
      blue: colors.sky,
      current: 'currentColor',
      gray: colors.coolGray,
      red: colors.red,
      teal: colors.teal,
      transparent: 'transparent',
      yellow: colors.amber,
    },
    fontFamily: {
      sans: 'Montserrat, sans-serif',
      mono: 'Roboto Mono, monospace',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
