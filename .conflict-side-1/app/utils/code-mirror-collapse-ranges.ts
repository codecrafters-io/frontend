import { Decoration, EditorView, GutterMarker, WidgetType, type DecorationSet } from '@codemirror/view';
import { EditorState, RangeSetBuilder, StateEffect, StateField } from '@codemirror/state';
import type { LineRange } from 'codecrafters-frontend/components/code-mirror';

type CollapseRangesGutterMarkers = GutterMarker & EventListenerObject;

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

export class CollapseRangesWidget extends WidgetType {
  #attachedGutterMarkers: CollapseRangesGutterMarkers[] = [];
  #lastRenderedElement?: HTMLElement;

  constructor(
    readonly startLine: number,
    readonly endLine: number,
    readonly totalLines: number,
  ) {
    super();
  }

  get estimatedHeight() {
    return this.isFirst || this.isLast ? 28 : 44;
  }

  get isFirst() {
    return this.startLine === 1;
  }

  get isLast() {
    return this.endLine === this.totalLines;
  }

  get lines() {
    return this.endLine - this.startLine + 1;
  }

  set isHovered(isHovered: boolean) {
    this.#lastRenderedElement?.classList.toggle('cm-collapseRangesHovered', isHovered);
  }

  attachGutterMarker(marker: CollapseRangesGutterMarkers) {
    this.#attachedGutterMarkers.push(marker);
    this.#lastRenderedElement?.addEventListener('mouseenter', marker);
    this.#lastRenderedElement?.addEventListener('mouseleave', marker);
  }

  detachGutterMarker(marker: CollapseRangesGutterMarkers) {
    const markerIndex = this.#attachedGutterMarkers.indexOf(marker);

    if (markerIndex !== -1) {
      this.#attachedGutterMarkers.splice(markerIndex, 1);
    }

    this.#lastRenderedElement?.removeEventListener('mouseenter', marker);
    this.#lastRenderedElement?.removeEventListener('mouseleave', marker);
  }

  eq(other: CollapseRangesWidget) {
    return this.startLine == other.startLine && this.endLine == other.endLine;
  }

  ignoreEvent(e: Event) {
    return e instanceof MouseEvent;
  }

  toDOM(view: EditorView) {
    const outer = document.createElement('div');
    outer.className = 'cm-collapsedRanges';

    if (this.isFirst) {
      outer.classList.add('cm-collapsedRangesFirst');
    } else if (this.isLast) {
      outer.classList.add('cm-collapsedRangesLast');
    }

    const inner = document.createElement('div');
    inner.className = 'cm-collapsedRangesInner';
    inner.textContent = view.state.phrase('Expand $ lines', this.lines);

    outer.appendChild(inner);
    outer.addEventListener('click', (e) => {
      const pos = view.posAtDOM(e.target as HTMLElement);
      view.dispatch({ effects: uncollapseRangesStateEffect.of(pos) });
    });

    for (const marker of this.#attachedGutterMarkers) {
      outer.addEventListener('mouseenter', marker);
      outer.addEventListener('mouseleave', marker);
    }

    this.#lastRenderedElement = outer;

    return outer;
  }
}

function buildCollapsedRangesDecorations(state: EditorState, collapsedRanges: LineRange[]) {
  const builder = new RangeSetBuilder<Decoration>();

  for (const { startLine, endLine } of collapsedRanges) {
    if (startLine >= 1 && endLine >= startLine && endLine <= state.doc.lines) {
      builder.add(
        state.doc.line(startLine).from,
        state.doc.line(endLine).to,
        Decoration.replace({
          widget: new CollapseRangesWidget(startLine, endLine, state.doc.lines),
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
    '--collapsed-ranges-padding-start': '0.625rem',
    '--collapsed-ranges-padding-end': '1rem',
    '--collapsed-ranges-padding-top': '0.3125rem',
    '--collapsed-ranges-padding-bottom': '0.3125rem',
    '& .cm-collapsedRangesInner': {
      padding:
        'var(--collapsed-ranges-padding-top) var(--collapsed-ranges-padding-end) var(--collapsed-ranges-padding-bottom) var(--collapsed-ranges-padding-start)',
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
    '& .cm-collapsedRanges': {
      '& .cm-collapsedRangesInner': {
        color: '#ddd',
        background: 'linear-gradient(to bottom, transparent 0, #222 30%, #222 70%, transparent 100%)',
      },
    },
  },
});

export function collapseRanges(collapsedRanges: LineRange[] = []) {
  return [baseTheme, initCollapsedRangesStateField(collapsedRanges)];
}
