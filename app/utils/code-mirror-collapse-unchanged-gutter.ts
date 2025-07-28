import { BlockInfo, EditorView, gutter, GutterMarker } from '@codemirror/view';
import { CollapseWidget, uncollapseUnchanged } from './code-mirror-collapse-unchanged';

function renderGutterMarker(view: EditorView, widget: CollapseWidget, line: BlockInfo) {
  const totalLines = view.state.doc.lines;
  const lineNumber = view.state.doc.lineAt(line.from).number;

  const el = document.createElement('div');
  el.className = 'cm-collapseUnchangedGutterMarker';

  if (lineNumber === 1) {
    el.classList.add('cm-collapseUnchangedGutterMarkerFirst');
  } else if (lineNumber + widget.lines - 1 >= totalLines) {
    el.classList.add('cm-collapseUnchangedGutterMarkerLast');
  }

  el.addEventListener('click', function () {
    view.dispatch({ effects: uncollapseUnchanged.of(line.from) });
  });

  el.addEventListener('mouseenter', function () {
    widget.isHovered = true;
  });

  el.addEventListener('mouseleave', function () {
    widget.isHovered = false;
  });

  return el;
}

export class CollapseUnchangedGutterMarker extends GutterMarker implements EventListenerObject {
  #lastRenderedElement?: HTMLElement;

  constructor(
    readonly view: EditorView,
    readonly widget: CollapseWidget,
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
      this.#lastRenderedElement?.classList.add('cm-collapseUnchangedGutterMarkerHovered');
    } else if (e.type === 'mouseleave') {
      this.#lastRenderedElement?.classList.remove('cm-collapseUnchangedGutterMarkerHovered');
    }
  }

  toDOM(view: EditorView) {
    this.#lastRenderedElement = renderGutterMarker(view, this.widget, this.line);

    return this.#lastRenderedElement;
  }
}

export function collapseUnchangedGutter() {
  return [
    gutter({
      class: 'cm-collapseUnchangedGutter',

      widgetMarker(view, widget, line) {
        return widget instanceof CollapseWidget ? new CollapseUnchangedGutterMarker(view, widget, line) : null;
      },
    }),

    gutter({
      class: 'cm-collapseUnchangedGutter',
      side: 'after',

      widgetMarker(view, widget, line) {
        return widget instanceof CollapseWidget ? new CollapseUnchangedGutterMarker(view, widget, line) : null;
      },
    }),
  ];
}
