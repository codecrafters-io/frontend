import { Decoration, EditorView, ViewPlugin, ViewUpdate, type DecorationSet } from '@codemirror/view';
import { RangeSetBuilder, StateEffect } from '@codemirror/state';
import { expandedLineNumbersCompartment, expandedLineNumbersFacet } from 'codecrafters-frontend/utils/code-mirror-line-comments';

const lineCommentsExpandedDecoration = Decoration.line({
  attributes: { class: 'cm-lineCommentsExpanded' },
});

function lineCommentsExpandedDecorations(view: EditorView) {
  const expandedLines = view.state.facet(expandedLineNumbersFacet)[0] || [];
  const builder = new RangeSetBuilder<Decoration>();

  for (const { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to; ) {
      const line = view.state.doc.lineAt(pos);

      if (expandedLines.includes(line.number)) {
        builder.add(line.from, line.from, lineCommentsExpandedDecoration);
      }

      pos = line.to + 1;
    }
  }

  return builder.finish();
}

export function lineCommentsExpandedPlugin() {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = lineCommentsExpandedDecorations(view);
      }

      update(update: ViewUpdate) {
        if (update.transactions) {
          for (const tr of update.transactions) {
            for (const effect of tr.effects) {
              if (effect instanceof StateEffect && effect.value?.compartment === expandedLineNumbersCompartment) {
                this.decorations = lineCommentsExpandedDecorations(update.view);
                break;
              }
            }
          }
        }
      }
    },
    {
      decorations: (v) => v.decorations,
    },
  );
}
