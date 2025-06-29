import { BlockInfo, EditorView } from '@codemirror/view';
import { gutter as gutterRS, GutterMarker as GutterMarkerRS } from 'codecrafters-frontend/utils/code-mirror-gutter-rs';
import { expandedLineNumbersCompartment, expandedLineNumbersFacet, lineDataFacet } from 'codecrafters-frontend/utils/code-mirror-line-comments';

class CommentsCountGutterMarker extends GutterMarkerRS {
  constructor(readonly line: BlockInfo) {
    super();
  }

  toDOM(view: EditorView) {
    const lineNumber = view.state.doc.lineAt(this.line.from).number;
    const commentsCount = view.state.facet(lineDataFacet)[0]?.dataForLine(lineNumber)?.commentsCount || 0;
    const elem = document.createElement('div');
    const classNames = ['cm-commentsCount'];

    if (commentsCount > 99) {
      classNames.push('cm-commentsCountOver99');
    }

    elem.className = classNames.join(' ');
    elem.innerText = `${commentsCount > 99 ? '99+' : commentsCount}`;

    return elem;
  }
}

class CommentButtonGutterMarker extends GutterMarkerRS {
  constructor(readonly line: BlockInfo) {
    super();
  }

  toDOM() {
    const elem = document.createElement('div');
    elem.className = 'cm-commentButton';

    elem.innerText = `💬`;

    return elem;
  }
}

function lineCommentsGutterLineMarker(view: EditorView, line: BlockInfo) {
  const lineNumber = view.state.doc.lineAt(line.from).number;
  const commentsCount = view.state.facet(lineDataFacet)[0]?.dataForLine(lineNumber)?.commentsCount || 0;

  return new (commentsCount === 0 ? CommentButtonGutterMarker : CommentsCountGutterMarker)(line);
}

function lineCommentsGutterClickHandler(view: EditorView, line: BlockInfo) {
  const lineNumber = view.state.doc.lineAt(line.from).number;
  const expandedLines = view.state.facet(expandedLineNumbersFacet)[0] || [];
  const newExpandedLines = expandedLines.includes(lineNumber) ? expandedLines.without(lineNumber) : [...expandedLines, lineNumber];

  view.dispatch({
    effects: [expandedLineNumbersCompartment.reconfigure(expandedLineNumbersFacet.of(newExpandedLines))],
  });

  return true;
}

const lineCommentsGutterBaseTheme = EditorView.baseTheme({
  '.cm-lineCommentsGutter': {
    minWidth: '24px',
    textAlign: 'center',
    userSelect: 'none',

    '& .cm-gutterElement': {
      cursor: 'pointer',

      '& .cm-commentButton': {
        opacity: '0.15',
      },

      '& .cm-commentsCount': {
        display: 'block',
        backgroundColor: '#ffcd72c0',
        borderRadius: '50%',
        color: '#24292e',
        transform: 'scale(0.75)',
        fontWeight: '500',
        fontSize: '12px',

        '&.cm-commentsCountOver99': {
          fontSize: '9.5px',
        },
      },

      '&:hover': {
        '& .cm-commentButton': {
          opacity: '1',
        },

        '& .cm-commentsCount': {
          backgroundColor: '#ffa500',
        },
      },
    },
  },
});

export function lineCommentsGutter() {
  return [
    gutterRS({
      class: 'cm-lineCommentsGutter',
      lineMarker: lineCommentsGutterLineMarker,
      domEventHandlers: {
        click: lineCommentsGutterClickHandler,
      },
    }),
    lineCommentsGutterBaseTheme,
  ];
}
