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
      gray: colors.blueGray,
      green: colors.green,
      indigo: colors.indigo,
      red: colors.red,
      teal: colors.teal,
      transparent: 'transparent',
      yellow: colors.yellow,
      white: 'white',
    },
    fontFamily: {
      sans: 'Montserrat, sans-serif',
      mono: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    },
    extend: {
      brightness: {
        102: '1.02',
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: colors.sky[500],
              fontWeight: '600',
            },
            'a:hover': {
              color: colors.sky[600],
            },
            'a code': {
              color: colors.sky[500],
            },
            'a code:hover': {
              color: colors.sky[600],
            },
            code: {
              color: colors.blueGray[700],
              fontWeight: 'normal',
              padding: '0.2em 0.4em',
              backgroundColor: colors.blueGray[100],
              borderRadius: '5px',
              whiteSpace: 'nowrap',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            pre: {
              color: colors.blueGray[700],
              backgroundColor: colors.blueGray[100],
            },
          },
        },
        blue: {
          css: {
            color: colors.sky[700],
            a: { color: colors.sky[700] },
            strong: { color: colors.sky[700] },
            b: { color: colors.sky[700] },
          },
        },
      },
    },
  },
  variants: {
    extend: {
      backdropDropShadow: ['hover', 'group-hover'],
      backgroundColor: ['active'],
      border: ['group-hover', 'active'],
      borderColor: ['active'],
      borderWidth: ['hover'],
      boxShadow: ['hover', 'group-hover', 'active'],
      brightness: ['group-hover'],
      display: ['group-hover'],
      filter: ['group-hover', 'hover'],
      fontStyle: ['group-hover'],
      scale: ['group-hover'],
      space: ['group-hover', 'hover'], // Used for blowing up spacing on hover
      translate: ['group-hover'],
      width: ['group-hover'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
