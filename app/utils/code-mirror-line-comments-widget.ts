import { Decoration, EditorView, WidgetType, type DecorationSet } from '@codemirror/view';
import { Line, StateEffect, StateField } from '@codemirror/state';
import { lineDataFacet, expandedLineNumbersFacet, expandedLineNumbersCompartment } from 'codecrafters-frontend/utils/code-mirror-line-comments';

class LineCommentsWidget extends WidgetType {
  line: Line;
  isExpanded: boolean;

  constructor(line: Line, isExpanded: boolean = false) {
    super();
    this.line = line;
    this.isExpanded = isExpanded;
  }

  toDOM(view: EditorView): HTMLElement {
    const expandedLines = view.state.facet(expandedLineNumbersFacet)[0] || [];
    const commentsCount = view.state.facet(lineDataFacet)[0]?.dataForLine(this.line.number)?.commentsCount || 0;
    const classNames = ['cm-lineCommentsWidget'];

    if (expandedLines.includes(this.line.number) || this.isExpanded) {
      classNames.push('cm-lineCommentsWidgetExpanded');
    }

    const elem = document.createElement('div');
    elem.className = classNames.join(' ');

    if (commentsCount) {
      elem.innerText = `💬 COMMENTS FOR LINE #${this.line.number} (COUNT: ${commentsCount})`;
    } else {
      elem.innerText = `💬 ADD COMMENT FOR LINE #${this.line.number}`;
    }

    return elem;
  }
}

function lineCommentsWidgetDecoration(line: Line) {
  return Decoration.widget({
    widget: new LineCommentsWidget(line),
    side: 10,
    // inlineOrder: true,
    // block: true,
  }).range(line.to);
}

const lineCommentsWidgetStateField = StateField.define<DecorationSet>({
  create(state) {
    return Decoration.set(Array.from({ length: state.doc.lines }, (_, i) => lineCommentsWidgetDecoration(state.doc.line(i + 1))));
  },

  update(decorations, transaction) {
    if (transaction.docChanged) {
      return this.create(transaction.state);
    }

    // let newDecorations = decorations.map(transaction.changes);

    for (const effect of transaction.effects) {
      if (effect instanceof StateEffect && effect.value?.compartment === expandedLineNumbersCompartment) {
        return this.create(transaction.state);

        // newDecorations = newDecorations.update({ filter: (pos) => pos !== effect.value.pos }).update({
        //   add: [lineCommentsWidgetDecoration(transaction.state.doc.lineAt(effect.value.pos))],
        // });
      }
    }

    // return newDecorations;

    return decorations;
  },

  provide(field) {
    return EditorView.decorations.from(field);
  },
});

const lineCommentsWidgetBaseTheme = EditorView.baseTheme({
  '.cm-line': {
    '& .cm-lineCommentsWidget': {
      display: 'none',
      backgroundColor: '#009bff40',
      paddingLeft: '1rem',
      marginRight: '-1rem',

      '&.cm-lineCommentsWidgetExpanded': {
        display: 'block',
        backgroundColor: '#009bff80',
      },

      '& + br': {
        display: 'none',
      },
    },

    '& .cm-insertedLine + br': {
      display: 'none',
    },
  },
});

export function lineCommentsWidget() {
  return [lineCommentsWidgetStateField, lineCommentsWidgetBaseTheme];
}
