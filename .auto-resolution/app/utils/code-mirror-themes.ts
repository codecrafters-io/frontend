import { EditorView } from '@codemirror/view';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import tailwindColors from 'tailwindcss/colors';
import blendColors from 'codecrafters-frontend/utils/blend-colors';

const BASE_STYLE = {
  // Main editor element (.cm-editor)
  '&': {
    '--line-height': '1.5rem',
    '--line-indentation-start': '0.625rem',
    '--line-indentation-end': '1rem',
  },

  // Container for all gutters
  '.cm-gutters': {
    '&.cm-gutters-before': {
      borderRight: 'none',
    },

    '&.cm-gutters-after': {
      borderLeft: 'none',
    },
  },

  // All gutter elements
  '.cm-gutterElement': {
    lineHeight: 'var(--line-height)',
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
        zIndex: -1,

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

      '&.cm-inlineChangedLineGutter': {
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
      '& .cm-collapseUnchangedGutterMarker': {
        position: 'absolute',
        left: 0,
        right: 0,
        height: '1.75rem',
        marginTop: '0.5rem',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderColor: tailwindColors.sky['100'],
        backgroundColor: tailwindColors.sky['50'],
        backgroundImage: 'url("/assets/images/codemirror/expand-diff-middle.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '12px 12px',
        cursor: 'pointer',

        '&:hover, &.cm-collapseUnchangedGutterMarkerHovered': {
          backgroundColor: tailwindColors.sky['100'],
          color: tailwindColors.sky['800'],
        },

        '&.cm-collapseUnchangedGutterMarkerFirst': {
          marginTop: '-0.5rem',
          borderTop: 'none',
          backgroundImage: 'url("/assets/images/codemirror/expand-diff-top.svg")',
        },

        '&.cm-collapseUnchangedGutterMarkerLast': {
          borderBottom: 'none',
          backgroundImage: 'url("/assets/images/codemirror/expand-diff-bottom.svg")',
        },
      },
    },
  },

  // Collapse ranges gutter
  '.cm-collapseRangesGutter': {
    '& .cm-gutterElement': {
      '& .cm-collapseRangesGutterMarker': {
        position: 'absolute',
        left: 0,
        right: 0,
        height: '1.75rem',
        marginTop: '0.5rem',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderColor: tailwindColors.sky['100'],
        backgroundColor: tailwindColors.sky['50'],
        backgroundImage: 'url("/assets/images/codemirror/expand-diff-middle.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '12px 12px',
        cursor: 'pointer',

        '&:hover, &.cm-collapseRangesGutterMarkerHovered': {
          backgroundColor: tailwindColors.sky['100'],
          color: tailwindColors.sky['800'],
        },

        '&.cm-collapseRangesGutterMarkerFirst': {
          marginTop: '-0.5rem',
          borderTop: 'none',
          backgroundImage: 'url("/assets/images/codemirror/expand-diff-top.svg")',
        },

        '&.cm-collapseRangesGutterMarkerLast': {
          borderBottom: 'none',
          backgroundImage: 'url("/assets/images/codemirror/expand-diff-bottom.svg")',
        },
      },
    },
  },

  // Document content area
  '.cm-content': {
    padding: '0.5rem 0',
  },

  // Expand unchanged lines bar
  '.cm-cc-collapsedLines': {
    padding: '0.5rem 0',

    '& .cm-cc-collapsedLinesInner': {
      height: '1.75rem', // h7
      borderTopWidth: '1px',
      borderBottomWidth: '1px',
      fontSize: '0.75rem', // text-xs
      fontFamily: 'Montserrat, sans-serif',
      lineHeight: '1rem', // text-xs
      background: tailwindColors.sky['50'],
      color: tailwindColors.sky['700'],
      borderColor: tailwindColors.sky['100'],

      '&:before, &:after': {
        content: 'none',
      },
    },

    '&:hover, &.cm-collapseUnchangedHovered': {
      '& .cm-cc-collapsedLinesInner': {
        background: tailwindColors.sky['100'],
        color: tailwindColors.sky['800'],
      },
    },

    '&.cm-cc-collapsedLinesFirst': {
      padding: 0,
      marginTop: '-0.5rem',
      marginBottom: '0.5rem',

      '& .cm-cc-collapsedLinesInner': {
        borderTop: 'none',
        paddingTop: 'calc(var(--collapsed-lines-padding-top) + 1px)',
      },
    },

    '&.cm-cc-collapsedLinesLast': {
      padding: 0,
      marginTop: '0.5rem',
      marginBottom: '-0.5rem',

      '& .cm-cc-collapsedLinesInner': {
        borderBottom: 'none',
      },
    },
  },

  // Expand collapsed ranges bar
  '.cm-collapsedRanges': {
    padding: '0.5rem 0',

    '& .cm-collapsedRangesInner': {
      height: '1.75rem', // h7
      borderTopWidth: '1px',
      borderBottomWidth: '1px',
      fontSize: '0.75rem', // text-xs
      fontFamily: 'Montserrat, sans-serif',
      lineHeight: '1rem', // text-xs
      background: tailwindColors.sky['50'],
      color: tailwindColors.sky['700'],
      borderColor: tailwindColors.sky['100'],

      '&:before, &:after': {
        content: 'none',
      },
    },

    '&:hover, &.cm-collapseRangesHovered': {
      '& .cm-collapsedRangesInner': {
        background: tailwindColors.sky['100'],
        color: tailwindColors.sky['800'],
      },
    },

    '&.cm-collapsedRangesFirst': {
      padding: 0,
      marginTop: '-0.5rem',
      marginBottom: '0.5rem',

      '& .cm-collapsedRangesInner': {
        borderTop: 'none',
        paddingTop: 'calc(var(--collapsed-ranges-padding-top) + 1px)',
      },
    },

    '&.cm-collapsedRangesLast': {
      padding: 0,
      marginTop: '0.5rem',
      marginBottom: '-0.5rem',

      '& .cm-collapsedRangesInner': {
        borderBottom: 'none',
      },
    },
  },

  // All lines in the document
  '.cm-line': {
    lineHeight: 'var(--line-height)',
    padding: '0 var(--line-indentation-end) 0 var(--line-indentation-start)',

    '&.cm-changedLine': {
      backgroundColor: 'rgba(0, 255, 0, 0.15)',

      '& .cm-changedText': {
        background: 'rgba(0, 255, 0, 0.25)',
      },
    },
  },

  // All deleted chunks in the document
  '.cm-deletedChunk': {
    lineHeight: 'var(--line-height)',
    padding: '0 var(--line-indentation-end) 0 var(--line-indentation-start)',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',

    '& del': {
      textDecoration: 'none',

      '& .cm-deletedText': {
        background: 'rgba(255, 0, 0, 0.2)',
      },
    },

    // If the first line of the document is both deleted and collapsed — deletedChunk widget
    // sticks above the first-child collapsedRanges bar and looks weird, we must hide it as
    // it's supposed to be "collapsed".
    '&:has(+ .cm-collapsedRangesFirst)': {
      display: 'none',
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
          '& .cm-collapseUnchangedGutterMarker': {
            borderColor: blendColors(tailwindColors.white, 0.075, blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800'])),
            backgroundColor: blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800']),
            backgroundImage: 'url("/assets/images/codemirror/expand-diff-middle-dark.svg")',

            '&:hover, &.cm-collapseUnchangedGutterMarkerHovered': {
              backgroundColor: blendColors(tailwindColors.sky['800'], 0.4, tailwindColors.slate['800']),
              color: tailwindColors.sky['300'],
            },

            '&.cm-collapseUnchangedGutterMarkerFirst': {
              backgroundImage: 'url("/assets/images/codemirror/expand-diff-top-dark.svg")',
            },

            '&.cm-collapseUnchangedGutterMarkerLast': {
              backgroundImage: 'url("/assets/images/codemirror/expand-diff-bottom-dark.svg")',
            },
          },
        },
      },

      // Collapse ranges gutter
      '.cm-collapseRangesGutter': {
        '& .cm-gutterElement': {
          '& .cm-collapseRangesGutterMarker': {
            borderColor: blendColors(tailwindColors.white, 0.075, blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800'])),
            backgroundColor: blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800']),
            backgroundImage: 'url("/assets/images/codemirror/expand-diff-middle-dark.svg")',

            '&:hover, &.cm-collapseRangesGutterMarkerHovered': {
              backgroundColor: blendColors(tailwindColors.sky['800'], 0.4, tailwindColors.slate['800']),
              color: tailwindColors.sky['300'],
            },

            '&.cm-collapseRangesGutterMarkerFirst': {
              backgroundImage: 'url("/assets/images/codemirror/expand-diff-top-dark.svg")',
            },

            '&.cm-collapseRangesGutterMarkerLast': {
              backgroundImage: 'url("/assets/images/codemirror/expand-diff-bottom-dark.svg")',
            },
          },
        },
      },

      // Expand unchanged lines bar
      '.cm-cc-collapsedLines': {
        '& .cm-cc-collapsedLinesInner': {
          background: blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800']),
          color: tailwindColors.sky['400'],
          borderColor: blendColors(tailwindColors.white, 0.075, blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800'])),
        },

        '&:hover, &.cm-collapseUnchangedHovered': {
          '& .cm-cc-collapsedLinesInner': {
            background: blendColors(tailwindColors.sky['800'], 0.4, tailwindColors.slate['800']),
            color: tailwindColors.sky['300'],
          },
        },
      },

      // Expand collapsed ranges bar
      '.cm-collapsedRanges': {
        '& .cm-collapsedRangesInner': {
          background: blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800']),
          color: tailwindColors.sky['400'],
          borderColor: blendColors(tailwindColors.white, 0.075, blendColors(tailwindColors.sky['900'], 0.4, tailwindColors.slate['800'])),
        },

        '&:hover, &.cm-collapseRangesHovered': {
          '& .cm-collapsedRangesInner': {
            background: blendColors(tailwindColors.sky['800'], 0.4, tailwindColors.slate['800']),
            color: tailwindColors.sky['300'],
          },
        },
      },
    },

    { dark: true },
  ),
  EditorView.theme(BASE_STYLE, { dark: true }),
  githubDark,
];
