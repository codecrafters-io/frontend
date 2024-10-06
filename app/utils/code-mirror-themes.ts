import { EditorView } from '@codemirror/view';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import tailwindColors from 'tailwindcss/colors';
import hexRgb from 'hex-rgb';
import rgbHex from 'rgb-hex';

function blendColors(fgColor = '#ffffff', opacity = 1, bgColor = '#ffffff') {
  const fgRgb = hexRgb(fgColor, { format: 'array' });
  const bgRgb = hexRgb(bgColor, { format: 'array' });

  const blendedRgb = fgRgb.slice(0, 3).map<number>((colFg, idx) => opacity * colFg + (1 - opacity) * (bgRgb[idx] || 255)) as [number, number, number];

  return `#${rgbHex(...blendedRgb)}`;
}

const BASE_STYLE = {
  '.cm-gutters': {
    borderRight: 'none',

    '& .cm-changeGutter': {
      width: 'auto',
      paddingLeft: 0,
    },
  },

  '.cm-gutterElement': {
    lineHeight: '1.5rem',

    '&.cm-deletedLineGutter': {
      background: 'rgba(255, 0, 0, 0.1)',

      '&:before': {
        content: '"-"',
        padding: '0 0.5rem',
        color: 'rgb(186 0 103)',
      },
    },

    '&.cm-changedLineGutter': {
      background: 'rgba(0, 255, 0, 0.15)',

      '&:before': {
        content: '"+"',
        padding: '0 0.5rem',
        color: 'rgb(102 153 0)',
      },
    },
  },

  '.cm-lineNumbers': {
    '& .cm-gutterElement': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 0.5rem 0 1rem',
      fontSize: '0.875em',
      color: '#94a3b8',
    },
  },

  '.cm-foldGutter': {
    '& .cm-gutterElement': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875em',
      minWidth: '1.2rem',
      color: '#94a3b8',
    },
  },

  '.cm-content': {
    padding: '0.5rem 0',
  },

  '.cm-collapsedLines': {
    height: '1.75rem', // h7
    paddingLeft: '74px',
    borderTopWidth: '1px',
    borderBottomWidth: '1px',
    fontSize: '0.75rem', // text-xs
    fontFamily: 'Montserrat, sans-serif',
    lineHeight: '1rem', // text-xs
    background: tailwindColors.sky['50'],
    color: tailwindColors.sky['700'],
    borderColor: tailwindColors.sky['100'],

    '&:before': {
      content: '"Expand"',
      position: 'absolute',
      height: '1.75rem',
      paddingLeft: '326px',
      marginLeft: '-368px',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      backgroundColor: tailwindColors.sky['50'],
      backgroundImage: 'url("/assets/images/codemirror/expand-diff-middle.svg")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '306px center',
      borderColor: tailwindColors.sky['100'],
      borderTopWidth: '1px',
      borderBottomWidth: '1px',
      paddingTop: '5px',
      paddingBottom: '5px',
      marginTop: '-6px',
      backgroundSize: '12px 12px',
      zIndex: '200',
    },

    '&:after': {
      content: '" "',
      position: 'absolute',
      marginLeft: '-5px',
      width: '20px',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      backgroundColor: tailwindColors.sky['50'],
    },

    '&:hover': {
      background: tailwindColors.sky['100'],
      color: tailwindColors.sky['800'],

      '&:before': {
        backgroundColor: tailwindColors.sky['100'],
        color: tailwindColors.sky['800'],
      },

      '&:after': {
        backgroundColor: tailwindColors.sky['100'],
        color: tailwindColors.sky['800'],
      },
    },

    '&:first-child': {
      borderTop: 'none',
      marginTop: '-0.5rem',
      marginBottom: '0.5rem',

      '&:before': {
        borderTop: 'none',
        marginTop: '-5px',
        backgroundImage: 'url("/assets/images/codemirror/expand-diff-top.svg")',
      },
    },

    '&:last-child': {
      borderBottom: 'none',
      marginTop: '0.5rem',
      marginBottom: '-0.5rem',

      '&:before': {
        borderBottom: 'none',
        backgroundImage: 'url("/assets/images/codemirror/expand-diff-bottom.svg")',
      },
    },
  },

  '.cm-line': {
    lineHeight: '1.5rem',
    padding: '0 1rem 0 0.625rem',

    '&.cm-changedLine': {
      backgroundColor: 'rgba(0, 255, 0, 0.15)',

      '& .cm-changedText': {
        background: 'rgba(0, 255, 0, 0.25)',
      },
    },
  },

  '.cm-deletedChunk': {
    lineHeight: '1.5rem',
    padding: '0 1rem 0 0.625rem',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',

    '& del': {
      textDecoration: 'none',

      '& .cm-deletedText': {
        background: 'rgba(255, 0, 0, 0.2)',
      },
    },
  },
};

export const codeCraftersLight = [EditorView.theme(BASE_STYLE, { dark: false }), githubLight];
export const codeCraftersDark = [
  EditorView.theme(
    {
      '&': {
        backgroundColor: tailwindColors.gray['900'],
      },

      '.cm-gutters': {
        backgroundColor: tailwindColors.gray['900'],
      },

      '.cm-collapsedLines': {
        background: blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800']),
        color: tailwindColors.sky['400'],
        borderColor: blendColors(tailwindColors.white, 0.075, blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800'])),

        '&:before': {
          backgroundColor: blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800']),
          backgroundImage: 'url("/assets/images/codemirror/expand-diff-middle-dark.svg")',
          borderColor: blendColors(tailwindColors.white, 0.075, blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800'])),
        },

        '&:after': {
          backgroundColor: blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800']),
        },

        '&:hover': {
          background: blendColors(tailwindColors.sky['800'], 0.4, tailwindColors.slate['800']),
          color: tailwindColors.sky['300'],

          '&:before': {
            backgroundColor: blendColors(tailwindColors.sky['800'], 0.4, tailwindColors.slate['800']),
            color: tailwindColors.sky['300'],
          },

          '&:after': {
            backgroundColor: blendColors(tailwindColors.sky['800'], 0.4, tailwindColors.slate['800']),
            color: tailwindColors.sky['300'],
          },
        },

        '&:first-child': {
          '&:before': {
            backgroundImage: 'url("/assets/images/codemirror/expand-diff-top-dark.svg")',
          },
        },

        '&:last-child': {
          '&:before': {
            backgroundImage: 'url("/assets/images/codemirror/expand-diff-bottom-dark.svg")',
          },
        },
      },
    },
    { dark: true },
  ),
  EditorView.theme(BASE_STYLE, { dark: true }),
  githubDark,
];
