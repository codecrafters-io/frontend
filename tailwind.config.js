/*global module*/
/*global require*/

const colors = require('tailwindcss/colors');

module.exports = {
  content: [`./app/**/*.{html,js,ts,hbs}`],
  safelist: {
    standard: [
      'inline', // Used by SVG stuff
      'mx-1', // Used by SVG stuff
      'w-4', // Used by SVG stuff
      'whitespace-nowrap', // Used by SVG stuff
    ],
    greedy: [/ember-basic-dropdown-/, /prose/],
    deep: [
      // Ember's built-in components: <Input /> and <TextArea />
      /^input$/,
      /^textarea$/,
      // There's something wrong with how we're picking styles from ember-animated
      /ember-animated/,
      /animated-container/,
      /animated-orphans/,
    ],
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      // Build your palette here
      black: 'black',
      blue: colors.sky,
      current: 'currentColor',
      gray: colors.slate,
      green: colors.green,
      indigo: colors.indigo,
      red: colors.red,
      sky: colors.sky,
      slate: colors.slate,
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
            '--tw-prose-links': colors.sky[500],
            maxWidth: '90ch', // Default is 65ch
            a: {
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
            blockquote: {
              fontWeight: '400',
            },
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:last-of-type::after': {
              content: 'none',
            },
            code: {
              color: colors.slate[700],
              fontWeight: 'bold',
              padding: '0.25em 0.45em',
              backgroundColor: colors.slate[100],
              borderRadius: '5px',
              whiteSpace: 'nowrap',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            pre: {
              color: colors.slate[700],
              fontWeight: 'bold',
              backgroundColor: colors.slate[100],
            },
          },
        },
        blue: {
          css: {
            '--tw-prose-body': colors.sky[700],
            '--tw-prose-headings': colors.sky[700],
            '--tw-prose-lead': colors.sky[700],
            '--tw-prose-links': colors.sky[800],
            '--tw-prose-bold': colors.sky[700],
            '--tw-prose-counters': colors.sky[700],
            '--tw-prose-bullets': colors.sky[700],
            '--tw-prose-hr': colors.sky[700],
            '--tw-prose-quotes': colors.sky[700],
            '--tw-prose-quote-borders': colors.sky[700],
            '--tw-prose-captions': colors.sky[700],
            '--tw-prose-code': colors.sky[700],
            '--tw-prose-pre-code': colors.sky[700],
            '--tw-prose-pre-bg': colors.sky[700],
            '--tw-prose-th-borders': colors.sky[700],
            '--tw-prose-td-borders': colors.sky[700],
            '--tw-prose-invert-body': colors.sky[500],
            '--tw-prose-invert-headings': colors.sky[500],
            '--tw-prose-invert-lead': colors.sky[500],
            '--tw-prose-invert-links': colors.sky[500],
            '--tw-prose-invert-bold': colors.sky[500],
            '--tw-prose-invert-counters': colors.sky[500],
            '--tw-prose-invert-bullets': colors.sky[500],
            '--tw-prose-invert-hr': colors.sky[500],
            '--tw-prose-invert-quotes': colors.sky[500],
            '--tw-prose-invert-quote-borders': colors.sky[500],
            '--tw-prose-invert-captions': colors.sky[500],
            '--tw-prose-invert-code': colors.sky[500],
            '--tw-prose-invert-pre-code': colors.sky[500],
            '--tw-prose-invert-pre-bg': colors.sky[500],
            '--tw-prose-invert-th-borders': colors.sky[500],
            '--tw-prose-invert-td-borders': colors.sky[500],
            'a:hover': {
              color: colors.sky[400],
            },
          },
        },
        green: {
          css: {
            color: colors.green[800],
            a: { color: colors.green[800] },
            strong: { color: colors.green[800] },
            b: { color: colors.green[800] },
            pre: {
              color: colors.green[800],
              backgroundColor: colors.green[200],
              borderWidth: '1px',
              borderColor: colors.green[300],
            },
            h3: {
              color: colors.green[800],
            },
          },
        },
        red: {
          css: {
            color: colors.red[700],
            a: { color: colors.red[700] },
            strong: { color: colors.red[700] },
            b: { color: colors.red[700] },
            ul: {
              listStyleType: 'disc',
              li: {
                '&::marker': {
                  color: colors.red[300],
                },
              },
            },
          },
        },
        compact: {
          css: {
            ':where(p):not(:where([class~="not-prose"],[class~="not-prose"] *))': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            ':where(.prose > :first-child):not(:where([class~="not-prose"],[class~="not-prose"] *))': {
              marginTop: '0',
            },
            '.prose :where(.prose > :last-child):not(:where([class~="not-prose"],[class~="not-prose"] *))': {
              marginBottom: '0',
            },
            pre: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
          },
        },
        invert: {
          css: {
            code: {
              color: colors.slate[300],
              backgroundColor: colors.slate[800],
            },
          },
        },
      },
      keyframes: {
        'infinite-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        blink: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'infinite-slide': 'infinite-slide 30s linear infinite',
        'blink-fast': 'blink 1s step-start infinite',
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
