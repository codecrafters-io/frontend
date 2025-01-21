import { EditorView } from '@codemirror/view';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import tailwindColors from 'tailwindcss/colors';
import blendColors from 'codecrafters-frontend/utils/blend-colors';

const BASE_STYLE = {
  // Container for all gutters
  '.cm-gutters': {
    borderRight: 'none',
  },

  // All gutter elements
  '.cm-gutterElement': {
    lineHeight: '1.5rem',
  },

  // Line numbers gutter
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

  // Fold indicators gutter
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

  // Changes gutter for diff +/- indicators
  '.cm-changeGutter': {
    width: 'auto',
    paddingLeft: 0,

    '& .cm-gutterElement': {
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
  },

  // Collapse unchanged lines gutter
  '.cm-collapseUnchangedGutter': {
    '& .cm-gutterElement': {
      '& .cm-collapseUnchangedGutterElement': {
        position: 'absolute',
        left: 0,
        right: 0,
        height: '1.75rem',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderColor: tailwindColors.sky['100'],
        backgroundColor: tailwindColors.sky['50'],
        backgroundImage: 'url("/assets/images/codemirror/expand-diff-middle.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '12px 12px',
        cursor: 'pointer',

        '&.cm-collapseUnchangedGutterElementFirst': {
          borderTop: 'none',
          marginTop: '-0.5rem',
          backgroundImage: 'url("/assets/images/codemirror/expand-diff-top.svg")',
        },

        '&.cm-collapseUnchangedGutterElementLast': {
          borderBottom: 'none',
          marginTop: '0.5rem',
          backgroundImage: 'url("/assets/images/codemirror/expand-diff-bottom.svg")',
        },
      },

      '&:hover': {
        '& .cm-collapseUnchangedGutterElement': {
          backgroundColor: tailwindColors.sky['100'],
          color: tailwindColors.sky['800'],
        },
      },
    },
  },

  // Document content area
  '.cm-content': {
    padding: '0.5rem 0',
  },

  // Expand unchanged lines bar
  '.cm-collapsedLines': {
    height: '1.75rem', // h7
    borderTopWidth: '1px',
    borderBottomWidth: '1px',
    fontSize: '0.75rem', // text-xs
    fontFamily: 'Montserrat, sans-serif',
    lineHeight: '1rem', // text-xs
    background: tailwindColors.sky['50'],
    color: tailwindColors.sky['700'],
    borderColor: tailwindColors.sky['100'],

    '&:hover': {
      background: tailwindColors.sky['100'],
      color: tailwindColors.sky['800'],
    },

    '&:before': {
      content: 'none',
    },

    '&:after': {
      content: 'none',
    },

    '&:first-child': {
      borderTop: 'none',
      marginTop: '-0.5rem',
      marginBottom: '0.5rem',
    },

    '&:last-child': {
      borderBottom: 'none',
      marginTop: '0.5rem',
      marginBottom: '-0.5rem',
    },
  },

  // All lines in the document
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

  // All deleted chunks in the document
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
      // Editor itself
      '&': {
        backgroundColor: tailwindColors.gray['900'],
      },

      // Container for all gutters
      '.cm-gutters': {
        backgroundColor: tailwindColors.gray['900'],
      },

      // Collapse unchanged lines gutter
      '.cm-collapseUnchangedGutter': {
        '& .cm-gutterElement': {
          '& .cm-collapseUnchangedGutterElement': {
            borderColor: blendColors(tailwindColors.white, 0.075, blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800'])),
            backgroundColor: blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800']),
            backgroundImage: 'url("/assets/images/codemirror/expand-diff-middle-dark.svg")',

            '&.cm-collapseUnchangedGutterElementFirst': {
              backgroundImage: 'url("/assets/images/codemirror/expand-diff-top-dark.svg")',
            },

            '&.cm-collapseUnchangedGutterElementLast': {
              backgroundImage: 'url("/assets/images/codemirror/expand-diff-bottom-dark.svg")',
            },
          },

          '&:hover': {
            '& .cm-collapseUnchangedGutterElement': {
              backgroundColor: blendColors(tailwindColors.sky['800'], 0.4, tailwindColors.slate['800']),
              color: tailwindColors.sky['300'],
            },
          },
        },
      },

      // Expand unchanged lines bar
      '.cm-collapsedLines': {
        background: blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800']),
        color: tailwindColors.sky['400'],
        borderColor: blendColors(tailwindColors.white, 0.075, blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800'])),

        '&:hover': {
          background: blendColors(tailwindColors.sky['800'], 0.4, tailwindColors.slate['800']),
          color: tailwindColors.sky['300'],
        },
      },
    },
    { dark: true },
  ),
  EditorView.theme(BASE_STYLE, { dark: true }),
  githubDark,
];
