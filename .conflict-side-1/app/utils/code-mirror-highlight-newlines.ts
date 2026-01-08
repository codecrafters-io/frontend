import type { Line } from '@codemirror/state';
import type { DecorationSet, ViewUpdate } from '@codemirror/view';
import { Decoration, EditorView, ViewPlugin, WidgetType } from '@codemirror/view';

class NewlineWidget extends WidgetType {
  line: Line;
  markerSymbol: string;

  constructor({ line, markerSymbol = '↵' }: { line: Line; markerSymbol?: string }) {
    super();
    this.line = line;
    this.markerSymbol = markerSymbol;
  }

  toDOM() {
    const span = document.createElement('span');

    span.textContent = this.markerSymbol;

    span.className = 'cm-newline';

    if (this.line.length === 0) {
      span.className += ' cm-newline-empty';
    }

    return span;
  }
}

const baseTheme = EditorView.baseTheme({
  '.cm-newline': {
    color: 'currentColor',
    pointerEvents: 'none',
    opacity: '0.5',
    '&:not(.cm-newline-empty)': {
      paddingLeft: '3px',
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
                widgets.push(Decoration.widget({ widget: new NewlineWidget({ line }), side: 1 }).range(pos));
              } else {
                widgets.push(Decoration.widget({ widget: new NewlineWidget({ line }), side: 1 }).range(line.to));
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
