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
  darkMode: ['variant', ['&:is(.dark *)']],
  theme: {
    colors: {
      // Build your palette here
      black: 'black',
      blue: colors.sky,
      current: 'currentColor',
      gray: colors.gray,
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
      mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    extend: {
      brightness: {
        102: '1.02',
      },
      colors: {
        gray: {
          925: '#0A1120',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-links': colors.sky[500],
            '--tw-prose-code': colors.slate[700],
            '--tw-prose-pre-bg': colors.slate[100],
            '--tw-prose-pre-code': colors.slate[700],
            '--tw-prose-invert-code': colors.slate[200],
            '--tw-prose-invert-pre-bg': colors.slate[800],
            '--tw-prose-invert-pre-code': colors.slate[200],
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
              fontWeight: 'normal',
              backgroundColor: 'var(--tw-prose-pre-bg)',
              padding: '0.2em 0.4em',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
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
            '--tw-prose-body': colors.green[700],
            '--tw-prose-headings': colors.green[700],
            '--tw-prose-lead': colors.green[700],
            '--tw-prose-links': colors.green[800],
            '--tw-prose-bold': colors.green[700],
            '--tw-prose-counters': colors.green[700],
            '--tw-prose-bullets': colors.green[700],
            '--tw-prose-hr': colors.green[700],
            '--tw-prose-quotes': colors.green[700],
            '--tw-prose-quote-borders': colors.green[700],
            '--tw-prose-captions': colors.green[700],
            '--tw-prose-code': colors.green[700],
            '--tw-prose-pre-code': colors.green[700],
            '--tw-prose-pre-bg': colors.green[700],
            '--tw-prose-th-borders': colors.green[700],
            '--tw-prose-td-borders': colors.green[700],
            '--tw-prose-invert-body': colors.green[500],
            '--tw-prose-invert-headings': colors.green[500],
            '--tw-prose-invert-lead': colors.green[500],
            '--tw-prose-invert-links': colors.green[500],
            '--tw-prose-invert-bold': colors.green[500],
            '--tw-prose-invert-counters': colors.green[500],
            '--tw-prose-invert-bullets': colors.green[500],
            '--tw-prose-invert-hr': colors.green[500],
            '--tw-prose-invert-quotes': colors.green[500],
            '--tw-prose-invert-quote-borders': colors.green[500],
            '--tw-prose-invert-captions': colors.green[500],
            '--tw-prose-invert-code': colors.green[500],
            '--tw-prose-invert-pre-code': colors.green[500],
            '--tw-prose-invert-pre-bg': colors.green[500],
            '--tw-prose-invert-th-borders': colors.green[500],
            '--tw-prose-invert-td-borders': colors.green[500],
            'a:hover': {
              color: colors.green[400],
            },
          },
        },

        red: {
          css: {
            '--tw-prose-body': colors.red[700],
            '--tw-prose-headings': colors.red[700],
            '--tw-prose-lead': colors.red[700],
            '--tw-prose-links': colors.red[800],
            '--tw-prose-bold': colors.red[700],
            '--tw-prose-counters': colors.red[700],
            '--tw-prose-bullets': colors.red[700],
            '--tw-prose-hr': colors.red[700],
            '--tw-prose-quotes': colors.red[700],
            '--tw-prose-quote-borders': colors.red[700],
            '--tw-prose-captions': colors.red[700],
            '--tw-prose-code': colors.red[700],
            '--tw-prose-pre-code': colors.red[700],
            '--tw-prose-pre-bg': colors.red[700],
            '--tw-prose-th-borders': colors.red[700],
            '--tw-prose-td-borders': colors.red[700],
            '--tw-prose-invert-body': colors.red[500],
            '--tw-prose-invert-headings': colors.red[500],
            '--tw-prose-invert-lead': colors.red[500],
            '--tw-prose-invert-links': colors.red[500],
            '--tw-prose-invert-bold': colors.red[500],
            '--tw-prose-invert-counters': colors.red[500],
            '--tw-prose-invert-bullets': colors.red[500],
            '--tw-prose-invert-hr': colors.red[500],
            '--tw-prose-invert-quotes': colors.red[500],
            '--tw-prose-invert-quote-borders': colors.red[500],
            '--tw-prose-invert-captions': colors.red[500],
            '--tw-prose-invert-code': colors.red[500],
            '--tw-prose-invert-pre-code': colors.red[500],
            '--tw-prose-invert-pre-bg': colors.red[500],
            '--tw-prose-invert-th-borders': colors.red[500],
            '--tw-prose-invert-td-borders': colors.red[500],
            'a:hover': {
              color: colors.red[400],
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
            '.prose :where(ul):not(:where([class~="not-prose"],[class~="not-prose"] *))': {
              marginTop: '0.6em',
            },
            '.prose :where(li):not(:where([class~="not-prose"],[class~="not-prose"] *))': {
              marginTop: '0.3em',
              marginBottom: '0.3em',
            },
            pre: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
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
        'spin-slow': 'spin 16s linear infinite',
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
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/container-queries')],
};
