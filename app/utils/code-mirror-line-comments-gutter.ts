import { BlockInfo, EditorView } from '@codemirror/view';
import {
  gutter as gutterRS,
  GutterMarker as GutterMarkerRS,
  highlightActiveLineGutter as highlightActiveLineGutterRS,
} from 'codecrafters-frontend/utils/code-mirror-gutter-rs';
import { lineDataFacet } from 'codecrafters-frontend/utils/code-mirror-line-comments';

class CommentsCountGutterMarker extends GutterMarkerRS {
  line: BlockInfo;

  constructor(line: BlockInfo) {
    super();
    this.line = line;
  }

  toDOM(view: EditorView) {
    const lineNumber = view.state.doc.lineAt(this.line.from).number;
    const commentsCount = view.state.facet(lineDataFacet)[0]?.dataForLine(lineNumber)?.commentsCount || 0;
    const elem = document.createElement('comments-count');

    elem.innerText = `${commentsCount > 99 ? '99+' : commentsCount}`;

    if (commentsCount > 99) {
      elem.className = 'cm-over-99';
    }

    return elem;
  }
}

class CommentButtonGutterMarker extends GutterMarkerRS {
  line: BlockInfo;

  constructor(line: BlockInfo) {
    super();
    this.line = line;
  }

  toDOM() {
    const elem = document.createElement('comment-button');

    elem.innerText = `💬`;

    return elem;
  }
}

export function lineCommentsGutter() {
  return [
    gutterRS({
      class: 'cm-lineCommentsGutter',

      lineMarker(view, line) {
        const lineNumber = view.state.doc.lineAt(line.from).number;
        const commentsCount = view.state.facet(lineDataFacet)[0]?.dataForLine(lineNumber)?.commentsCount || 0;

        return new (commentsCount === 0 ? CommentButtonGutterMarker : CommentsCountGutterMarker)(line);
      },
    }),

    highlightActiveLineGutterRS(),

    EditorView.baseTheme({
      '.cm-gutters.cm-gutters-rs': {
        backgroundColor: '#ffffff20', // '#ff000070', // 'transparent',

        '& .cm-lineCommentsGutter': {
          minWidth: '24px',
          textAlign: 'center',

          '& .cm-gutterElement': {
            cursor: 'pointer',

            '& comments-count': {
              display: 'block',
              backgroundColor: '#ffcd72c0',
              borderRadius: '50%',
              color: '#24292e',
              transform: 'scale(0.75)',
              fontWeight: '500',
              fontSize: '12px',

              '&.cm-over-99': {
                fontSize: '9.5px',
              },
            },

            '& comment-button': {
              opacity: '0.15',
            },

            '&:hover': {
              '& comment-button': {
                opacity: '1',
              },

              '& comments-count': {
                backgroundColor: '#ffa500',
              },
            },
          },
        },
      },
    }),
  ];
}
