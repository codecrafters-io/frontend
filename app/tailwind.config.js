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
      yellow: colors.yellow,
      white: 'white',
    },
    fontFamily: {
      sans: 'Montserrat, sans-serif',
      mono: 'Roboto Mono, monospace',
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            code: {
              color: colors.coolGray[700],
              fontWeight: 'normal',
              padding: '0.2em 0.4em',
              backgroundColor: colors.coolGray[100],
              borderRadius: '5px',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            pre: {
              color: colors.coolGray[700],
              backgroundColor: colors.coolGray[100],
            },
          },
        },
      },
    },
  },
  variants: {
    extend: {
      width: ['group-hover'],
      scale: ['group-hover'],
      translate: ['group-hover'],
      display: ['group-hover'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
