import { EditorView } from '@codemirror/view';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';

const BASE_STYLE = {
  '.cm-gutters': {
    borderRight: 'none',
  },
  '.cm-content': {
    padding: '0.5rem 0',
  },
  '.cm-gutterElement': {
    lineHeight: '1.5rem',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 0.5rem 0 1rem',
    fontSize: '0.875em',
    color: '#94a3b8',
  },
  '.cm-foldGutter .cm-gutterElement': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875em',
    minWidth: '1.2rem',
    color: '#94a3b8',
  },
  '.cm-line': {
    lineHeight: '1.5rem',
    padding: '0 1rem 0 0.625rem',
  },
  '.cm-deletedChunk': {
    lineHeight: '1.5rem',
    padding: '0 1rem 0 0.625rem',
  },
};

export const codeCraftersLight = [EditorView.theme(Object.assign({}, BASE_STYLE), { dark: false }), githubLight];
export const codeCraftersDark = [
  EditorView.theme(
    Object.assign({}, BASE_STYLE, {
      '.cm-gutters': {
        backgroundColor: '#0d1117',
      },
    }),
    { dark: true },
  ),
  githubDark,
];
