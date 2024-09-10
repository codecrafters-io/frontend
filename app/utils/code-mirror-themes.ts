import { EditorView } from '@codemirror/view';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';

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
    background: 'rgb(240 249 255)', // bg-sky-50
    color: 'rgb(3 105 161)', // text-sky-700
    borderColor: 'rgb(224 242 254)', // border-sky-100

    '&:before': {
      content: '"Expand"',
      position: 'absolute',
      height: '1.75rem',
      paddingLeft: '26px',
      marginLeft: '-68px',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      backgroundColor: 'rgb(240 249 255)', // bg-sky-50
      backgroundImage: 'url("/assets/images/svg-icons/expand-diff-middle.svg")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '6px center',
      borderColor: 'rgb(224 242 254)', // border-sky-100
      borderTopWidth: '1px',
      borderBottomWidth: '1px',
      paddingTop: '5px',
      paddingBottom: '5px',
      marginTop: '-6px',
      backgroundSize: '12px 12px',
    },

    '&:after': {
      content: '" "',
      position: 'absolute',
      marginLeft: '-5px',
      width: '20px',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      backgroundColor: 'rgb(240 249 255)', // bg-sky-50
    },

    '&:hover': {
      background: 'rgb(224 242 254)', // bg-sky-100
      color: 'rgb(7 89 133)', // text-sky-800

      '&:before': {
        backgroundColor: 'rgb(224 242 254)', // bg-sky-100
        color: 'rgb(7 89 133)', // text-sky-800
      },

      '&:after': {
        backgroundColor: 'rgb(224 242 254)', // bg-sky-100
        color: 'rgb(7 89 133)', // text-sky-800
      },
    },

    '&:first-child': {
      borderTop: 'none',
      marginTop: '-0.5rem',
      marginBottom: '0.5rem',

      '&:before': {
        borderTop: 'none',
        marginTop: '-5px',
        backgroundImage: 'url("/assets/images/svg-icons/expand-diff-top.svg")',
      },
    },

    '&:last-child': {
      borderBottom: 'none',
      marginTop: '0.5rem',
      marginBottom: '-0.5rem',

      '&:before': {
        borderBottom: 'none',
        backgroundImage: 'url("/assets/images/svg-icons/expand-diff-bottom.svg")',
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
        backgroundColor: 'rgb(15 23 42)', // bg-gray-900
      },

      '.cm-gutters': {
        backgroundColor: 'rgb(15 23 42)', // bg-gray-900
        borderRight: '1px solid rgba(255, 255, 255, 0.025)',
      },

      '.cm-collapsedLines': {
        background: 'rgb(22.8 54.2 79.4)', // bg-sky-900/40
        color: 'rgb(56 189 248)', // text-sky-400
        borderColor: 'rgba(255, 255, 255, 0.05)', // border-white/5

        '&:before': {
          backgroundColor: 'rgb(22.8 54.2 79.4)', // bg-sky-900/40
          backgroundImage: 'url("/assets/images/svg-icons/expand-diff-middle-dark.svg")',
          borderColor: 'rgba(255, 255, 255, 0.05)', // border-white/5
        },

        '&:after': {
          backgroundColor: 'rgb(22.8 54.2 79.4)', // bg-sky-900/40
        },

        '&:hover': {
          background: 'rgb(20.8 60.2 88.6)', // bg-sky-800/40
          color: 'rgb(125 211 252)', // text-sky-300

          '&:before': {
            backgroundColor: 'rgb(20.8 60.2 88.6)', // bg-sky-800/40
            color: 'rgb(125 211 252)', // text-sky-300
          },

          '&:after': {
            backgroundColor: 'rgb(20.8 60.2 88.6)', // bg-sky-800/40
            color: 'rgb(125 211 252)', // text-sky-300
          },
        },

        '&:first-child': {
          '&:before': {
            backgroundImage: 'url("/assets/images/svg-icons/expand-diff-top-dark.svg")',
          },
        },

        '&:last-child': {
          '&:before': {
            backgroundImage: 'url("/assets/images/svg-icons/expand-diff-bottom-dark.svg")',
          },
        },
      },
    },
    { dark: true },
  ),
  EditorView.theme(BASE_STYLE, { dark: false }),
  githubDark,
];
