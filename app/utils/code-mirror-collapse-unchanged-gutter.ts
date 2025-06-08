import { BlockInfo, EditorView, gutter, GutterMarker } from '@codemirror/view';
import { gutter as gutterRS, GutterMarker as GutterMarkerRS } from 'codecrafters-frontend/utils/code-mirror-gutter-rs';
import { CollapseWidget, uncollapseUnchanged } from './code-mirror-collapse-unchanged';

function renderGutterMarker(view: EditorView, widget: CollapseWidget, line: BlockInfo) {
  const totalLines = view.state.doc.lines;
  const lineNumber = view.state.doc.lineAt(line.from).number;
  const collapsedLinesCount = widget instanceof CollapseWidget ? widget.lines : 1;

  const el = document.createElement('div');
  el.className = 'cm-collapseUnchangedGutterMarker';

  if (lineNumber === 1) {
    el.classList.add('cm-collapseUnchangedGutterMarkerFirst');
  } else if (lineNumber + collapsedLinesCount - 1 >= totalLines) {
    el.classList.add('cm-collapseUnchangedGutterMarkerLast');
  }

  el.addEventListener('click', function () {
    view.dispatch({ effects: uncollapseUnchanged.of(line.from) });
  });

  el.addEventListener('mouseenter', function () {
    widget.lastRenderedElement?.classList.add('cm-collapseUnchangedHovered');
  });

  el.addEventListener('mouseleave', function () {
    widget.lastRenderedElement?.classList.remove('cm-collapseUnchangedHovered');
  });

  return el;
}

export class CollapseUnchangedGutterMarker extends GutterMarker implements EventListenerObject {
  lastRenderedElement?: HTMLElement;

  constructor(
    readonly view: EditorView,
    readonly widget: CollapseWidget,
    readonly line: BlockInfo,
  ) {
    super();

    this.widget.attachedGutterMarkers.push(this);
    this.widget.lastRenderedElement?.addEventListener('mouseenter', this);
    this.widget.lastRenderedElement?.addEventListener('mouseleave', this);
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  destroy() {
    this.widget.attachedGutterMarkers.removeAt(this.widget.attachedGutterMarkers.indexOf(this));
    this.widget.lastRenderedElement?.removeEventListener('mouseenter', this);
    this.widget.lastRenderedElement?.removeEventListener('mouseleave', this);
  }

  handleEvent(e: MouseEvent) {
    if (e.type === 'mouseenter') {
      this.lastRenderedElement?.classList.add('cm-collapseUnchangedGutterMarkerHovered');
    } else if (e.type === 'mouseleave') {
      this.lastRenderedElement?.classList.remove('cm-collapseUnchangedGutterMarkerHovered');
    }
  }

  toDOM(view: EditorView) {
    this.lastRenderedElement = renderGutterMarker(view, this.widget, this.line);

    return this.lastRenderedElement;
  }
}

export class CollapseUnchangedGutterMarkerRS extends GutterMarkerRS implements EventListenerObject {
  lastRenderedElement?: HTMLElement;

  constructor(
    readonly view: EditorView,
    readonly widget: CollapseWidget,
    readonly line: BlockInfo,
  ) {
    super();

    this.widget.attachedGutterMarkers.push(this);
    this.widget.lastRenderedElement?.addEventListener('mouseenter', this);
    this.widget.lastRenderedElement?.addEventListener('mouseleave', this);
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  destroy() {
    this.widget.attachedGutterMarkers.removeAt(this.widget.attachedGutterMarkers.indexOf(this));
    this.widget.lastRenderedElement?.removeEventListener('mouseenter', this);
    this.widget.lastRenderedElement?.removeEventListener('mouseleave', this);
  }

  handleEvent(e: MouseEvent) {
    if (e.type === 'mouseenter') {
      this.lastRenderedElement?.classList.add('cm-collapseUnchangedGutterMarkerHovered');
    } else if (e.type === 'mouseleave') {
      this.lastRenderedElement?.classList.remove('cm-collapseUnchangedGutterMarkerHovered');
    }
  }

  toDOM(view: EditorView) {
    this.lastRenderedElement = renderGutterMarker(view, this.widget, this.line);

    return this.lastRenderedElement;
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

    gutterRS({
      class: 'cm-collapseUnchangedGutter',

      widgetMarker(view, widget, line) {
        return widget instanceof CollapseWidget ? new CollapseUnchangedGutterMarkerRS(view, widget, line) : null;
      },
    }),
  ];
}
