import { BlockInfo, Decoration, EditorView, WidgetType, type DecorationSet } from '@codemirror/view';
import { EditorState, Facet, Line, StateField } from '@codemirror/state';
import {
  gutter as gutterRS,
  GutterMarker as GutterMarkerRS,
  highlightActiveLineGutter as highlightActiveLineGutterRS,
} from 'codecrafters-frontend/utils/code-mirror-gutter-rs';

export type LineCommentsCollection = (undefined | LineComment[])[];

export class LineComment {
  lineNumber: number;
  text: string;
  author: string;

  constructor({ lineNumber, text, author }: { lineNumber: number; text: string; author: string }) {
    this.lineNumber = lineNumber;
    this.text = text;
    this.author = author;
  }
}

class CommentsWidget extends WidgetType {
  line: Line;

  constructor(line: Line) {
    super();
    this.line = line;
  }

  toDOM(view: EditorView): HTMLElement {
    const comments = (view.state.facet(lineCommentsFacet)[0] || [])[this.line.number - 1];
    const elem = document.createElement('line-comments');

    if (comments?.length) {
      elem.innerText = `💬 COMMENTS (${comments?.length || 0}) FOR LINE #${this.line.number}`;
    }

    return elem;
  }
}

function lineCommentsDecorations(state: EditorState) {
  const decorations = [];

  for (let i = 1; i <= state.doc.lines; i++) {
    const line = state.doc.line(i);
    decorations.push(
      Decoration.widget({
        widget: new CommentsWidget(line),
        side: 10,
        // inlineOrder: true,
        // block: true,
      }).range(line.to),
    );
  }

  return Decoration.set(decorations);
}

const lineCommentsStateField = StateField.define<DecorationSet>({
  create(state) {
    return lineCommentsDecorations(state);
  },
  update(_value, tr) {
    return lineCommentsDecorations(tr.state);
    // return tr.docChanged ? lineCommentsDecorations(tr.state) : value;
  },
  provide(field) {
    return EditorView.decorations.from(field);
  },
});

const lineCommentsFacet = Facet.define<LineCommentsCollection>();

class CommentsCountGutterMarker extends GutterMarkerRS {
  line: BlockInfo;

  constructor(line: BlockInfo) {
    super();
    this.line = line;
  }

  toDOM(view: EditorView) {
    const lineNumber = view.state.doc.lineAt(this.line.from).number;
    const comments = (view.state.facet(lineCommentsFacet)[0] || [])[lineNumber - 1];
    const commentsCount = comments?.length || 0;
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

export function lineComments(comments: LineCommentsCollection) {
  return [
    lineCommentsFacet.of(comments),

    lineCommentsStateField,

    gutterRS({
      class: 'cm-lineCommentsGutter',

      lineMarker(view, line) {
        const lineNumber = view.state.doc.lineAt(line.from).number;
        const comments = (view.state.facet(lineCommentsFacet)[0] || [])[lineNumber - 1];
        const commentsCount = comments?.length || 0;

        return new (commentsCount === 0 ? CommentButtonGutterMarker : CommentsCountGutterMarker)(line);
      },
    }),

    highlightActiveLineGutterRS(),

    EditorView.baseTheme({
      '.cm-line': {
        '& line-comments': {
          display: 'block',
          backgroundColor: '#009bff40',
          paddingLeft: '1rem',
          marginRight: '-1rem',

          '& + br': {
            display: 'none',
          },
        },

        '& .cm-insertedLine + br': {
          display: 'none',
        },
      },

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
