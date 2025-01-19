import { BlockInfo, Decoration, EditorView, WidgetType, type DecorationSet } from '@codemirror/view';
import { EditorState, Facet, Line, StateField } from '@codemirror/state';
import {
  gutter as gutterRS,
  GutterMarker as GutterMarkerRS,
  highlightActiveLineGutter as highlightActiveLineGutterRS,
} from 'codecrafters-frontend/utils/code-mirror-gutter-rs';

export class LineData {
  lineNumber: number;
  commentsCount: number;

  constructor({ lineNumber, commentsCount }: { lineNumber: number; commentsCount: number }) {
    this.lineNumber = lineNumber;
    this.commentsCount = commentsCount;
  }
}

export class LineDataCollection {
  #lineData: LineData[];

  constructor(lineData: LineData[] = []) {
    this.#lineData = lineData;
  }

  dataForLine(lineNumber: number) {
    return this.#lineData.find((c) => c.lineNumber === lineNumber);
  }
}

class CommentsWidget extends WidgetType {
  line: Line;

  constructor(line: Line) {
    super();
    this.line = line;
  }

  toDOM(view: EditorView): HTMLElement {
    const commentsCount = view.state.facet(lineDataFacet)[0]?.dataForLine(this.line.number)?.commentsCount || 0;

    const elem = document.createElement('line-comments');

    if (commentsCount) {
      elem.innerText = `💬 COMMENTS FOR LINE #${this.line.number} (COUNT: ${commentsCount})`;
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

const lineDataFacet = Facet.define<LineDataCollection>();

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

export function lineComments(lineData: LineDataCollection) {
  return [
    lineDataFacet.of(lineData),

    lineCommentsStateField,

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
