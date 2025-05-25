import { Decoration, EditorView, WidgetType, type DecorationSet } from '@codemirror/view';
import { EditorState, RangeSetBuilder, StateEffect, StateField } from '@codemirror/state';
import type { LineRange } from 'codecrafters-frontend/components/code-mirror';

export const uncollapseRangesStateEffect = StateEffect.define<number>({
  map: (value, change) => change.mapPos(value),
});

const CollapsedRangesStateField = StateField.define<DecorationSet>({
  create(_state) {
    return Decoration.none;
  },

  update(deco, tr) {
    deco = deco.map(tr.changes);

    for (const e of tr.effects) {
      if (e.is(uncollapseRangesStateEffect)) {
        deco = deco.update({ filter: (from) => from != e.value });
      }
    }

    return deco;
  },

  provide: (f) => EditorView.decorations.from(f),
});

export class CollapsedRangesWidget extends WidgetType {
  constructor(
    readonly startLine: number,
    readonly endLine: number,
  ) {
    super();
  }

  get estimatedHeight() {
    return 27;
  }

  get lines() {
    return this.endLine - this.startLine + 1;
  }

  eq(other: CollapsedRangesWidget) {
    return this.startLine == other.startLine && this.endLine == other.endLine;
  }

  ignoreEvent(e: Event) {
    return e instanceof MouseEvent;
  }

  toDOM(view: EditorView) {
    const outer = document.createElement('div');
    outer.className = 'cm-collapsedRanges';
    outer.textContent = view.state.phrase('Expand $ lines', this.lines);

    outer.addEventListener('click', (e) => {
      const pos = view.posAtDOM(e.target as HTMLElement);
      view.dispatch({ effects: uncollapseRangesStateEffect.of(pos) });
    });

    return outer;
  }
}

function buildCollapsedRangesDecorations(state: EditorState, collapsedRanges: LineRange[]) {
  const builder = new RangeSetBuilder<Decoration>();

  for (const { startLine, endLine } of collapsedRanges) {
    if (startLine <= state.doc.lines && endLine <= state.doc.lines) {
      builder.add(
        state.doc.line(startLine).from,
        state.doc.line(endLine).to,
        Decoration.replace({
          widget: new CollapsedRangesWidget(startLine, endLine),
          block: true,
        }),
      );
    }
  }

  return builder.finish();
}

function initCollapsedRangesStateField(collapsedRanges: LineRange[] = []) {
  return CollapsedRangesStateField.init((state) => buildCollapsedRangesDecorations(state, collapsedRanges));
}

const baseTheme = EditorView.baseTheme({
  '& .cm-collapsedRanges': {
    padding: '5px 5px 5px 10px',
    background: 'linear-gradient(to bottom, transparent 0, #f3f3f3 30%, #f3f3f3 70%, transparent 100%)',
    color: '#444',
    cursor: 'pointer',
    '&:before': {
      content: '"⦚"',
      marginInlineEnd: '7px',
    },
    '&:after': {
      content: '"⦚"',
      marginInlineStart: '7px',
    },
  },

  '&dark': {
    '& .cm-collapsedRanges': {
      color: '#ddd',
      background: 'linear-gradient(to bottom, transparent 0, #222 30%, #222 70%, transparent 100%)',
    },
  },
});

export function collapseRanges(collapsedRanges: LineRange[] = []) {
  return collapsedRanges
    ? [
        EditorState.phrases.of({
          'Expand $ lines': 'Expand $ lines',
        }),
        baseTheme,
        initCollapsedRangesStateField(collapsedRanges),
      ]
    : [];
}
