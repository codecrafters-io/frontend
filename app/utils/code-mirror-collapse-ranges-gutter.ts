import { BlockInfo, EditorView, gutter, GutterMarker } from '@codemirror/view';
import { gutter as gutterRS, GutterMarker as GutterMarkerRS } from 'codecrafters-frontend/utils/code-mirror-gutter-rs';
import { CollapsedRangesWidget, uncollapseRangesStateEffect } from 'codecrafters-frontend/utils/code-mirror-collapse-ranges';

function renderGutterMarker(view: EditorView, widget: CollapsedRangesWidget, line: BlockInfo) {
  const totalLines = view.state.doc.lines;
  const lineNumber = view.state.doc.lineAt(line.from).number;

  const el = document.createElement('div');
  el.className = 'cm-collapseRangesGutterMarker';

  if (lineNumber === 1) {
    el.classList.add('cm-collapseRangesGutterMarkerFirst');
  } else if (lineNumber + widget.lines - 1 >= totalLines) {
    el.classList.add('cm-collapseRangesGutterMarkerLast');
  }

  el.addEventListener('click', function () {
    view.dispatch({ effects: uncollapseRangesStateEffect.of(line.from) });
  });

  el.addEventListener('mouseenter', function () {
    widget.isHovered = true;
  });

  el.addEventListener('mouseleave', function () {
    widget.isHovered = false;
  });

  return el;
}

export class CollapseRangesGutterMarker extends GutterMarker implements EventListenerObject {
  #lastRenderedElement?: HTMLElement;

  constructor(
    readonly view: EditorView,
    readonly widget: CollapsedRangesWidget,
    readonly line: BlockInfo,
  ) {
    super();
    widget.attachGutterMarker(this);
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  destroy() {
    this.widget.detachGutterMarker(this);
  }

  handleEvent(e: MouseEvent) {
    if (e.type === 'mouseenter') {
      this.#lastRenderedElement?.classList.add('cm-collapseRangesGutterMarkerHovered');
    } else if (e.type === 'mouseleave') {
      this.#lastRenderedElement?.classList.remove('cm-collapseRangesGutterMarkerHovered');
    }
  }

  toDOM(view: EditorView) {
    this.#lastRenderedElement = renderGutterMarker(view, this.widget, this.line);

    return this.#lastRenderedElement;
  }
}

export class CollapseRangesGutterMarkerRS extends GutterMarkerRS implements EventListenerObject {
  #lastRenderedElement?: HTMLElement;

  constructor(
    readonly view: EditorView,
    readonly widget: CollapsedRangesWidget,
    readonly line: BlockInfo,
  ) {
    super();
    widget.attachGutterMarker(this);
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  destroy() {
    this.widget.detachGutterMarker(this);
  }

  handleEvent(e: MouseEvent) {
    if (e.type === 'mouseenter') {
      this.#lastRenderedElement?.classList.add('cm-collapseRangesGutterMarkerHovered');
    } else if (e.type === 'mouseleave') {
      this.#lastRenderedElement?.classList.remove('cm-collapseRangesGutterMarkerHovered');
    }
  }

  toDOM(view: EditorView) {
    this.#lastRenderedElement = renderGutterMarker(view, this.widget, this.line);

    return this.#lastRenderedElement;
  }
}

export function collapseRangesGutter() {
  return [
    gutter({
      class: 'cm-collapseRangesGutter',

      widgetMarker(view, widget, line) {
        return widget instanceof CollapsedRangesWidget ? new CollapseRangesGutterMarker(view, widget, line) : null;
      },
    }),

    gutterRS({
      class: 'cm-collapseRangesGutter',

      widgetMarker(view, widget, line) {
        return widget instanceof CollapsedRangesWidget ? new CollapseRangesGutterMarkerRS(view, widget, line) : null;
      },
    }),
  ];
}
