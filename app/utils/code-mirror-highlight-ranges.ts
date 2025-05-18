import { Decoration, EditorView, gutter, gutterLineClass, GutterMarker, ViewPlugin, type DecorationSet, type ViewUpdate } from '@codemirror/view';
import { RangeSetBuilder, Facet, RangeSet } from '@codemirror/state';
import type { LinesRange } from './code-mirror-documents';

const highlightedRangesFacet = Facet.define<LinesRange[]>({
  static: true,
});

const highlightedLineDecoration = Decoration.line({
  attributes: { class: 'cm-highlightedLine' },
});

function highlightedRangesDecoration(view: EditorView) {
  const highlightedRanges = view.state.facet(highlightedRangesFacet)[0] || [];
  const builder = new RangeSetBuilder<Decoration>();

  for (const { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to; ) {
      const line = view.state.doc.lineAt(pos);

      if (highlightedRanges.find((range) => line.number >= range.startLine && line.number <= range.endLine)) {
        builder.add(line.from, line.from, highlightedLineDecoration);
      }

      pos = line.to + 1;
    }
  }

  return builder.finish();
}

const highlightRangesViewPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = highlightedRangesDecoration(view);
    }

    update(update: ViewUpdate) {
      this.decorations = highlightedRangesDecoration(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);

class HighlightedLineGutterMarker extends GutterMarker {
  elementClass = 'cm-highlightedLineGutterSibling';
}

const highlightedRangesGutter = gutter({
  class: 'cm-highlightedRangesGutter',
  renderEmptyElements: true,
});

const highlightedLinesGutterHighlighter = gutterLineClass.compute(['doc', highlightedRangesFacet], (state) => {
  const highlightedRanges = state.facet(highlightedRangesFacet)[0] || [];
  const marks = [];

  for (const range of highlightedRanges) {
    for (let lineNumber = range.startLine; lineNumber <= range.endLine; lineNumber++) {
      if (lineNumber <= state.doc.lines) {
        const linePos = state.doc.line(lineNumber).from;
        marks.push(new HighlightedLineGutterMarker().range(linePos));
      }
    }
  }

  try {
    return RangeSet.of(marks);
  } catch (e) {
    console.error(`Failed to highlight lines in the gutter: ${e instanceof Error ? e.message : e}`);

    return RangeSet.of([]);
  }
});

const baseTheme = EditorView.baseTheme({
  '& .cm-gutterElement': {
    '&.cm-highlightedLineGutterSibling': {
      position: 'relative',

      '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 248, 197, 1)',
        opacity: 0.6,
        zIndex: -1,
      },
    },
  },

  '& .cm-highlightedRangesGutter': {
    position: 'absolute',
    left: 0,
    width: '2px',

    '& .cm-gutterElement': {
      '&.cm-highlightedLineGutterSibling': {
        '&:before': {
          boxShadow: 'inset 2px 0 0 rgba(154, 103, 0, 1)',
          zIndex: 1,
        },
        '&.cm-activeLineGutter': {
          '&:before': {
            opacity: 0.8,
          },
        },
      },
    },
  },

  '& .cm-line': {
    '&.cm-highlightedLine': {
      position: 'relative',

      '&:before': {
        content: '""',
        position: 'absolute',
        display: 'block',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 248, 197, 1)',
        opacity: 0.6,
        zIndex: -1,
      },
    },
  },

  '&dark': {
    '& .cm-gutterElement': {
      '&.cm-highlightedLineGutterSibling': {
        '&:before': {
          backgroundColor: 'rgba(187, 128, 9, 0.15)',
        },
      },
    },

    '& .cm-highlightedRangesGutter': {
      '& .cm-gutterElement': {
        '&.cm-highlightedLineGutterSibling': {
          '&:before': {
            boxShadow: 'inset 2px 0 0 rgba(210, 153, 34, 1)',
          },
        },
      },
    },

    '& .cm-line': {
      '&.cm-highlightedLine': {
        '&:before': {
          backgroundColor: 'rgba(187, 128, 9, 0.15)',
        },
      },
    },
  },
});

export function highlightRanges(highlightedRanges: LinesRange[] = []) {
  return [
    baseTheme,
    highlightedRangesFacet.of(highlightedRanges),
    highlightedRangesGutter,
    highlightedLinesGutterHighlighter,
    highlightRangesViewPlugin,
  ];
}
