import { Decoration, EditorView, WidgetType, type DecorationSet } from '@codemirror/view';
import { EditorState, Line, StateField } from '@codemirror/state';
import { lineDataFacet } from 'codecrafters-frontend/utils/code-mirror-line-comments';

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

export function lineCommentsWidget() {
  return [
    lineCommentsStateField,

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
    }),
  ];
}
