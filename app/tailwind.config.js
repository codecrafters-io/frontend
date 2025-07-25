/*global module*/
/*global require*/

const colors = require('tailwindcss/colors');

/* Picked from https://github.com/tailwindlabs/tailwindcss-typography/blob/25051fbfd7c7058708233b1b4c6280f039e5855d/src/styles.js */
const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '');
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;

module.exports = {
  content: [`./app/**/*.{html,js,ts,hbs,gts}`],
  darkMode: ['variant', ['&:is(.dark *)']],
  theme: {
    colors: {
      // Build your palette here
      amber: colors.amber,
      black: 'black',
      blue: colors.sky,
      current: 'currentColor',
      gray: colors.slate,
      green: colors.green,
      indigo: colors.indigo,
      pink: colors.pink,
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
          850: '#172033',
          925: '#0A1120',
        },
      },
      fontSize: {
        xxs: ['0.625rem', '0.75rem'], // 10px font size with 12px line height
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-bold': colors.slate[800],
            '--tw-prose-code': colors.slate[700],
            '--tw-prose-links': colors.sky[500],
            '--tw-prose-pre-bg': colors.slate[100],
            '--tw-prose-pre-code': colors.slate[700],
            '--tw-prose-invert-bold': colors.slate[200],
            '--tw-prose-invert-code': colors.slate[300],
            '--tw-prose-invert-headings': colors.slate[200],
            '--tw-prose-invert-links': colors.sky[500],
            '--tw-prose-invert-pre-bg': colors.slate[900],
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
              padding: '0.2em 0.4em',
              borderWidth: '1px',
              borderColor: colors.gray[200],
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              backgroundColor: 'var(--tw-prose-pre-bg)',
              '.dark &': {
                borderColor: 'rgba(255,255,255,0.1)',
              },
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
        // Copied from https://github.com/tailwindlabs/tailwindcss-typography/blob/25051fbfd7c7058708233b1b4c6280f039e5855d/src/styles.js#L20, adapted for "xs"
        xs: {
          css: [
            {
              fontSize: rem(12),
              lineHeight: round(20 / 12),
              p: {
                marginTop: em(12, 12),
                marginBottom: em(12, 12),
              },
              '[class~="lead"]': {
                fontSize: em(15, 12),
                lineHeight: round(22 / 15),
                marginTop: em(12, 15),
                marginBottom: em(12, 15),
              },
              blockquote: {
                marginTop: em(18, 15),
                marginBottom: em(18, 15),
                paddingInlineStart: em(16, 15),
              },
              h1: {
                fontSize: em(22, 12),
                marginTop: '0',
                marginBottom: em(18, 22),
                lineHeight: round(28 / 22),
              },
              h2: {
                fontSize: em(16, 12),
                marginTop: em(24, 16),
                marginBottom: em(12, 16),
                lineHeight: round(22 / 16),
              },
              h3: {
                fontSize: em(14, 12),
                marginTop: em(20, 14),
                marginBottom: em(6, 14),
                lineHeight: round(20 / 14),
              },
              h4: {
                marginTop: em(14, 12),
                marginBottom: em(6, 12),
                lineHeight: round(16 / 12),
              },
              img: {
                marginTop: em(18, 12),
                marginBottom: em(18, 12),
              },
              picture: {
                marginTop: em(18, 12),
                marginBottom: em(18, 12),
              },
              'picture > img': {
                marginTop: '0',
                marginBottom: '0',
              },
              video: {
                marginTop: em(18, 12),
                marginBottom: em(18, 12),
              },
              kbd: {
                fontSize: em(10, 12),
                borderRadius: rem(4),
                paddingTop: em(2, 12),
                paddingInlineEnd: em(4, 12),
                paddingBottom: em(2, 12),
                paddingInlineStart: em(4, 12),
              },
              code: {
                fontSize: em(10, 12),
              },
              'h2 code': {
                fontSize: em(13, 16),
              },
              'h3 code': {
                fontSize: em(12, 14),
              },
              pre: {
                fontSize: em(10, 12),
                lineHeight: round(16 / 10),
                marginTop: em(14, 10),
                marginBottom: em(14, 10),
                borderRadius: rem(3),
                paddingTop: em(6, 10),
                paddingInlineEnd: em(8, 10),
                paddingBottom: em(6, 10),
                paddingInlineStart: em(8, 10),
              },
              ol: {
                marginTop: em(12, 12),
                marginBottom: em(12, 12),
                paddingInlineStart: em(18, 12),
              },
              ul: {
                marginTop: em(12, 12),
                marginBottom: em(12, 12),
                paddingInlineStart: em(18, 12),
              },
              li: {
                marginTop: em(3, 12),
                marginBottom: em(3, 12),
              },
              'ol > li': {
                paddingInlineStart: em(4, 12),
              },
              'ul > li': {
                paddingInlineStart: em(4, 12),
              },
              '> ul > li p': {
                marginTop: em(6, 12),
                marginBottom: em(6, 12),
              },
              '> ul > li > p:first-child': {
                marginTop: em(12, 12),
              },
              '> ul > li > p:last-child': {
                marginBottom: em(12, 12),
              },
              '> ol > li > p:first-child': {
                marginTop: em(12, 12),
              },
              '> ol > li > p:last-child': {
                marginBottom: em(12, 12),
              },
              'ul ul, ul ol, ol ul, ol ol': {
                marginTop: em(6, 12),
                marginBottom: em(6, 12),
              },
              dl: {
                marginTop: em(12, 12),
                marginBottom: em(12, 12),
              },
              dt: {
                marginTop: em(12, 12),
              },
              dd: {
                marginTop: em(3, 12),
                paddingInlineStart: em(18, 12),
              },
              hr: {
                marginTop: em(30, 12),
                marginBottom: em(30, 12),
              },
              'hr + *': {
                marginTop: '0',
              },
              'h2 + *': {
                marginTop: '0',
              },
              'h3 + *': {
                marginTop: '0',
              },
              'h4 + *': {
                marginTop: '0',
              },
              table: {
                fontSize: em(10, 12),
                lineHeight: round(14 / 10),
              },
              'thead th': {
                paddingInlineEnd: em(8, 10),
                paddingBottom: em(6, 10),
                paddingInlineStart: em(8, 10),
              },
              'thead th:first-child': {
                paddingInlineStart: '0',
              },
              'thead th:last-child': {
                paddingInlineEnd: '0',
              },
              'tbody td, tfoot td': {
                paddingTop: em(6, 10),
                paddingInlineEnd: em(8, 10),
                paddingBottom: em(6, 10),
                paddingInlineStart: em(8, 10),
              },
              'tbody td:first-child, tfoot td:first-child': {
                paddingInlineStart: '0',
              },
              'tbody td:last-child, tfoot td:last-child': {
                paddingInlineEnd: '0',
              },
              figure: {
                marginTop: em(18, 12),
                marginBottom: em(18, 12),
              },
              'figure > *': {
                marginTop: '0',
                marginBottom: '0',
              },
              figcaption: {
                fontSize: em(10, 12),
                lineHeight: round(13 / 10),
                marginTop: em(6, 10),
              },
            },
            {
              '> :first-child': {
                marginTop: '0',
              },
              '> :last-child': {
                marginBottom: '0',
              },
            },
          ],
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
};
