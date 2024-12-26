import { EditorView, type DecorationSet, type ViewUpdate } from '@codemirror/view';
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view';

class NewlineWidget extends WidgetType {
  toDOM() {
    const span = document.createElement('span');
    span.className = 'cm-newline';
    span.textContent = '↵';

    return span;
  }
}

const baseTheme = EditorView.baseTheme({
  '.cm-newline': {
    color: 'currentColor',
    pointerEvents: 'none',
    opacity: '0.5',
    '&:not(:only-of-type)': {
      paddingLeft: '5px',
    },
  },
});

function highlightNewlines() {
  return [
    ViewPlugin.fromClass(
      class {
        decorations: DecorationSet;
        constructor(view: EditorView) {
          this.decorations = this.getDecorations(view);
        }

        getDecorations(view: EditorView) {
          const widgets = [];

          for (const { from, to } of view.visibleRanges) {
            for (let pos = from; pos <= to; ) {
              const line = view.state.doc.lineAt(pos);

              if (line.length === 0) {
                widgets.push(Decoration.widget({ widget: new NewlineWidget(), side: 1 }).range(pos));
              } else {
                widgets.push(Decoration.widget({ widget: new NewlineWidget(), side: 1 }).range(line.to));
              }

              pos = line.to + 1;
            }
          }

          return Decoration.set(widgets, true);
        }

        update(update: ViewUpdate) {
          if (update.docChanged || update.viewportChanged) {
            this.decorations = this.getDecorations(update.view);
          }
        }
      },
      {
        decorations: (v) => v.decorations,
      },
    ),
    baseTheme,
  ];
}

export { highlightNewlines };
