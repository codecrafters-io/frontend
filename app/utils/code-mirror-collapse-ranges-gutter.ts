import { BlockInfo, EditorView, gutter, GutterMarker } from '@codemirror/view';
import { gutter as gutterRS, GutterMarker as GutterMarkerRS } from 'codecrafters-frontend/utils/code-mirror-gutter-rs';
import { CollapsedRangesWidget, uncollapseRangesStateEffect } from 'codecrafters-frontend/utils/code-mirror-collapse-ranges';

function renderGutterMarker(view: EditorView, widget: CollapsedRangesWidget, line: BlockInfo) {
  const totalLines = view.state.doc.lines;
  const lineNumber = view.state.doc.lineAt(line.from).number;
  const collapsedLinesCount = widget instanceof CollapsedRangesWidget ? widget.lines : 1;

  const el = document.createElement('div');
  el.className = 'cm-collapseRangesGutterMarker';

  if (lineNumber === 1) {
    el.classList.add('cm-collapseRangesGutterMarkerFirst');
  } else if (lineNumber + collapsedLinesCount - 1 >= totalLines) {
    el.classList.add('cm-collapseRangesGutterMarkerLast');
  }

  el.addEventListener('click', function () {
    view.dispatch({ effects: uncollapseRangesStateEffect.of(line.from) });
  });

  el.addEventListener('mouseenter', function () {
    widget.lastRenderedElement?.classList.add('cm-collapsedRangesHovered');
  });

  el.addEventListener('mouseleave', function () {
    widget.lastRenderedElement?.classList.remove('cm-collapsedRangesHovered');
  });

  widget.lastRenderedElement?.addEventListener('mouseenter', function () {
    el.classList.add('cm-collapseRangesGutterMarkerHovered');
  });

  widget.lastRenderedElement?.addEventListener('mouseleave', function () {
    el.classList.remove('cm-collapseRangesGutterMarkerHovered');
  });

  return el;
}

export class CollapseRangesGutterMarker extends GutterMarker {
  line: BlockInfo;
  view: EditorView;
  widget: CollapsedRangesWidget;

  constructor(view: EditorView, widget: CollapsedRangesWidget, line: BlockInfo) {
    super();
    this.line = line;
    this.view = view;
    this.widget = widget;
  }

  toDOM(view: EditorView) {
    return renderGutterMarker(view, this.widget, this.line);
  }
}

export class CollapseRangesGutterMarkerRS extends GutterMarkerRS {
  line: BlockInfo;
  view: EditorView;
  widget: CollapsedRangesWidget;

  constructor(view: EditorView, widget: CollapsedRangesWidget, line: BlockInfo) {
    super();
    this.line = line;
    this.view = view;
    this.widget = widget;
  }

  toDOM(view: EditorView) {
    return renderGutterMarker(view, this.widget, this.line);
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
