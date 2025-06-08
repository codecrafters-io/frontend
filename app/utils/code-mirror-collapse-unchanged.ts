import { Decoration, EditorView, GutterMarker, WidgetType, type DecorationSet } from '@codemirror/view';
import { EditorState, RangeSetBuilder, StateEffect, StateField, Text } from '@codemirror/state';
import { Chunk } from '@codemirror/merge';

type CollapseUnchangedGutterMarkers = GutterMarker & EventListenerObject;

export const uncollapseUnchanged = StateEffect.define<number>({
  map: (value, change) => change.mapPos(value),
});

const setChunks = StateEffect.define<readonly Chunk[]>();

export class CollapseWidget extends WidgetType {
  #attachedGutterMarkers: CollapseUnchangedGutterMarkers[] = [];
  #lastRenderedElement?: HTMLElement;

  constructor(
    readonly collapseFrom: number,
    readonly collapseTo: number,
    readonly totalLines: number,
  ) {
    super();
  }

  get estimatedHeight() {
    return this.isFirst || this.isLast ? 28 : 44;
  }

  get isFirst() {
    return this.collapseFrom === 1;
  }

  get isLast() {
    return this.collapseTo === this.totalLines;
  }

  get lines() {
    return this.collapseTo - this.collapseFrom + 1;
  }

  set isHovered(isHovered: boolean) {
    this.#lastRenderedElement?.classList.toggle('cm-collapseUnchangedHovered', isHovered);
  }

  attachGutterMarker(marker: CollapseUnchangedGutterMarkers) {
    this.#attachedGutterMarkers.push(marker);
    this.#lastRenderedElement?.addEventListener('mouseenter', marker);
    this.#lastRenderedElement?.addEventListener('mouseleave', marker);
  }

  detachGutterMarker(marker: CollapseUnchangedGutterMarkers) {
    this.#attachedGutterMarkers.splice(this.#attachedGutterMarkers.indexOf(marker), 1);
    this.#lastRenderedElement?.removeEventListener('mouseenter', marker);
    this.#lastRenderedElement?.removeEventListener('mouseleave', marker);
  }

  eq(other: CollapseWidget) {
    return this.collapseFrom == other.collapseFrom && this.collapseTo == other.collapseTo;
  }

  ignoreEvent(e: Event) {
    return e instanceof MouseEvent;
  }

  toDOM(view: EditorView) {
    const outer = document.createElement('div');
    outer.className = 'cm-cc-collapsedLines';

    if (this.isFirst) {
      outer.classList.add('cm-cc-collapsedLinesFirst');
    } else if (this.isLast) {
      outer.classList.add('cm-cc-collapsedLinesLast');
    }

    const inner = document.createElement('div');
    inner.className = 'cm-cc-collapsedLinesInner';
    inner.textContent = view.state.phrase('$ unchanged lines', this.lines);

    outer.appendChild(inner);
    outer.addEventListener('click', (e) => {
      const pos = view.posAtDOM(e.target as HTMLElement);
      view.dispatch({ effects: uncollapseUnchanged.of(pos) });
      // const { side, sibling } = view.state.facet(mergeConfig);
      // if (sibling) sibling().dispatch({ effects: uncollapseUnchanged.of(mapPos(pos, view.state.field(ChunkField), side == 'a')) });
    });

    for (const marker of this.#attachedGutterMarkers) {
      outer.addEventListener('mouseenter', marker);
      outer.addEventListener('mouseleave', marker);
    }

    this.#lastRenderedElement = outer;

    return outer;
  }
}

const CollapsedRanges = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },

  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const e of tr.effects) if (e.is(uncollapseUnchanged)) deco = deco.update({ filter: (from) => from != e.value });

    return deco;
  },

  provide: (f) => EditorView.decorations.from(f),
});

const ChunkField = StateField.define<readonly Chunk[]>({
  create() {
    return null!;
  },

  update(current, tr) {
    for (const e of tr.effects) if (e.is(setChunks)) current = e.value;

    return current;
  },
});

function buildCollapsedRanges(state: EditorState, margin: number, minLines: number) {
  const builder = new RangeSetBuilder<Decoration>();
  const isA = true; // state.facet(mergeConfig).side == 'a';
  const chunks = state.field(ChunkField);
  let prevLine = 1;

  for (let i = 0; ; i++) {
    const chunk = i < chunks.length ? chunks[i] : null;
    const collapseFrom = i ? prevLine + margin : 1;
    const collapseTo = chunk ? state.doc.lineAt(isA ? chunk.fromA : chunk.fromB).number - 1 - margin : state.doc.lines;
    const lines = collapseTo - collapseFrom + 1;

    if (lines >= minLines) {
      builder.add(
        state.doc.line(collapseFrom).from,
        state.doc.line(collapseTo).to,
        Decoration.replace({
          widget: new CollapseWidget(collapseFrom, collapseTo, state.doc.lines),
          block: true,
        }),
      );
    }

    if (!chunk) break;
    prevLine = state.doc.lineAt(Math.min(state.doc.length, isA ? chunk.toA : chunk.toB)).number;
  }

  return builder.finish();
}

const baseTheme = EditorView.baseTheme({
  '& .cm-cc-collapsedLines': {
    '& .cm-cc-collapsedLinesInner': {
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
  },

  '&dark': {
    '& .cm-cc-collapsedLines': {
      '& .cm-cc-collapsedLinesInner': {
        color: '#ddd',
        background: 'linear-gradient(to bottom, transparent 0, #222 30%, #222 70%, transparent 100%)',
      },
    },
  },
});

export function collapseUnchanged({ margin = 3, minSize = 4, original = '' }: { margin?: number; minSize?: number; original: string }) {
  const orig = typeof original == 'string' ? Text.of(original.split(/\r?\n/)) : original;

  return [
    baseTheme,
    CollapsedRanges.init((state) => buildCollapsedRanges(state, margin, minSize)),
    ChunkField.init((state) => Chunk.build(orig, state.doc, { scanLimit: 500 })),
  ];
}
