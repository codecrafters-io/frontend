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

/**
 * Mixes two OKLCH colors according to a given ratio.
 * @param {string} color1 - First color in oklch format (e.g. 'oklch(0.70 0.10 240)')
 * @param {string} color2 - Second color in oklch format (e.g. 'oklch(0.45 0.18 100)')
 * @param {number} ratio - Value from 0 (all color1) to 1 (all color2)
 * @returns {string} Resulting mixed color in oklch format
 */
function mixOklch(color1, color2, ratio) {
  // Clamp ratio
  ratio = Math.max(0, Math.min(ratio, 1));

  // Parses oklch(color) string and returns array [l, c, h]
  function parseOklch(str) {
    // Remove 'oklch(' prefix and ')' suffix
    const m = str.trim().match(/^oklch\(\s*([.\d]+%?)\s+([.\d]+)\s+([.\d]+)(?:\s*\/\s*[.\d]+)?\s*\)$/i);
    if (!m) throw new Error(`Invalid OKLCH color: ${str}`);

    // Handle percentage in lightness value (convert to 0-1 range)
    let l = parseFloat(m[1]);

    if (m[1].includes('%')) {
      l = l / 100;
    }

    return [l, parseFloat(m[2]), parseFloat(m[3])];
  }

  // Interpolates two numbers, with optional hue interpolation using shortest angle
  function interpolate(a, b, t, isHue) {
    if (isHue) {
      // Both are in [0, 360)
      let delta = b - a;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      return (((a + delta * t) % 360) + 360) % 360;
    }

    return a * (1 - t) + b * t;
  }

  const [l1, c1, h1] = parseOklch(color1);
  const [l2, c2, h2] = parseOklch(color2);

  const l = interpolate(l1, l2, ratio, false);
  const c = interpolate(c1, c2, ratio, false);
  const h = interpolate(h1, h2, ratio, true);

  // Clamp values to their valid ranges
  const clampedL = Math.max(0, Math.min(l, 1));
  const clampedC = Math.max(0, c); // Chroma has no upper bound, but can't be <0
  const clampedH = ((h % 360) + 360) % 360;

  return `oklch(${clampedL.toFixed(4)} ${clampedC.toFixed(4)} ${clampedH.toFixed(2)})`;
}

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
      gray: colors.gray,
      green: colors.green,
      indigo: colors.indigo,
      purple: colors.purple,
      pink: colors.pink,
      red: colors.red,
      sky: colors.sky,
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
          825: mixOklch(colors.gray[800], colors.gray[900], 0.25),
          850: mixOklch(colors.gray[800], colors.gray[900], 0.5),
          925: mixOklch(colors.gray[900], colors.gray[950], 0.5),
        },
      },
      fontSize: {
        xxs: ['0.625rem', '0.75rem'], // 10px font size with 12px line height
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-bold': colors.gray[800],
            '--tw-prose-code': colors.gray[700],
            '--tw-prose-links': colors.sky[500],
            '--tw-prose-pre-bg': colors.gray[100],
            '--tw-prose-pre-code': colors.gray[700],
            '--tw-prose-invert-bold': colors.gray[200],
            '--tw-prose-invert-code': colors.gray[300],
            '--tw-prose-invert-headings': colors.gray[200],
            '--tw-prose-invert-links': colors.sky[500],
            '--tw-prose-invert-pre-bg': colors.gray[900],
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
            '--tw-prose-invert-body': colors.sky[400],
            '--tw-prose-invert-headings': colors.sky[400],
            '--tw-prose-invert-lead': colors.sky[400],
            '--tw-prose-invert-links': colors.sky[300],
            '--tw-prose-invert-bold': colors.sky[400],
            '--tw-prose-invert-counters': colors.sky[400],
            '--tw-prose-invert-bullets': colors.sky[400],
            '--tw-prose-invert-hr': colors.sky[400],
            '--tw-prose-invert-quotes': colors.sky[400],
            '--tw-prose-invert-quote-borders': colors.sky[400],
            '--tw-prose-invert-captions': colors.sky[400],
            '--tw-prose-invert-code': colors.sky[400],
            '--tw-prose-invert-pre-code': colors.sky[400],
            '--tw-prose-invert-pre-bg': colors.sky[400],
            '--tw-prose-invert-th-borders': colors.sky[400],
            '--tw-prose-invert-td-borders': colors.sky[400],
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
        teal: {
          css: {
            '--tw-prose-body': colors.teal[700],
            '--tw-prose-headings': colors.teal[700],
            '--tw-prose-lead': colors.teal[700],
            '--tw-prose-links': colors.teal[800],
            '--tw-prose-bold': colors.teal[700],
            '--tw-prose-counters': colors.teal[700],
            '--tw-prose-bullets': colors.teal[700],
            '--tw-prose-hr': colors.teal[700],
            '--tw-prose-quotes': colors.teal[700],
            '--tw-prose-quote-borders': colors.teal[700],
            '--tw-prose-captions': colors.teal[700],
            '--tw-prose-code': colors.teal[700],
            '--tw-prose-pre-code': colors.teal[700],
            '--tw-prose-pre-bg': colors.teal[700],
            '--tw-prose-th-borders': colors.teal[700],
            '--tw-prose-td-borders': colors.teal[700],
            '--tw-prose-invert-body': colors.teal[500],
            '--tw-prose-invert-headings': colors.teal[500],
            '--tw-prose-invert-lead': colors.teal[500],
            '--tw-prose-invert-links': colors.teal[500],
            '--tw-prose-invert-bold': colors.teal[500],
            '--tw-prose-invert-counters': colors.teal[500],
            '--tw-prose-invert-bullets': colors.teal[500],
            '--tw-prose-invert-hr': colors.teal[500],
            '--tw-prose-invert-quotes': colors.teal[500],
            '--tw-prose-invert-quote-borders': colors.teal[500],
            '--tw-prose-invert-captions': colors.teal[500],
            '--tw-prose-invert-code': colors.teal[500],
            '--tw-prose-invert-pre-code': colors.teal[500],
            '--tw-prose-invert-pre-bg': colors.teal[500],
            '--tw-prose-invert-th-borders': colors.teal[500],
            '--tw-prose-invert-td-borders': colors.teal[500],
            'a:hover': {
              color: colors.teal[400],
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
        yellow: {
          css: {
            '--tw-prose-body': colors.yellow[700],
            '--tw-prose-headings': colors.yellow[700],
            '--tw-prose-lead': colors.yellow[700],
            '--tw-prose-links': colors.yellow[800],
            '--tw-prose-bold': colors.yellow[700],
            '--tw-prose-counters': colors.yellow[700],
            '--tw-prose-bullets': colors.yellow[700],
            '--tw-prose-hr': colors.yellow[700],
            '--tw-prose-quotes': colors.yellow[700],
            '--tw-prose-quote-borders': colors.yellow[700],
            '--tw-prose-captions': colors.yellow[700],
            '--tw-prose-code': colors.yellow[700],
            '--tw-prose-pre-code': colors.yellow[700],
            '--tw-prose-pre-bg': colors.yellow[700],
            '--tw-prose-th-borders': colors.yellow[700],
            '--tw-prose-td-borders': colors.yellow[700],
            '--tw-prose-invert-body': colors.yellow[500],
            '--tw-prose-invert-headings': colors.yellow[500],
            '--tw-prose-invert-lead': colors.yellow[500],
            '--tw-prose-invert-links': colors.yellow[500],
            '--tw-prose-invert-bold': colors.yellow[500],
            '--tw-prose-invert-counters': colors.yellow[500],
            '--tw-prose-invert-bullets': colors.yellow[500],
            '--tw-prose-invert-hr': colors.yellow[500],
            '--tw-prose-invert-quotes': colors.yellow[500],
            '--tw-prose-invert-quote-borders': colors.yellow[500],
            '--tw-prose-invert-captions': colors.yellow[500],
            '--tw-prose-invert-code': colors.yellow[500],
            '--tw-prose-invert-pre-code': colors.yellow[500],
            '--tw-prose-invert-pre-bg': colors.yellow[500],
            '--tw-prose-invert-th-borders': colors.yellow[500],
            '--tw-prose-invert-td-borders': colors.yellow[500],
            'a:hover': {
              color: colors.yellow[400],
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
        'text-shimmer': {
          '0%': { backgroundPosition: '100% center' },
          '100%': { backgroundPosition: '0% center' },
        },
      },
      animation: {
        'infinite-slide': 'infinite-slide 30s linear infinite',
        'blink-fast': 'blink 1s step-start infinite',
        'spin-slow': 'spin 16s linear infinite',
        'spin-medium': 'spin 4s linear infinite',
        'text-shimmer': 'text-shimmer var(--shimmer-duration, 2s) linear infinite',
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
