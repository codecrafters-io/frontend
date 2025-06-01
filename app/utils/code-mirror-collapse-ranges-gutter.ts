import { BlockInfo, EditorView, gutter, GutterMarker, type WidgetType } from '@codemirror/view';
import { gutter as gutterRS, GutterMarker as GutterMarkerRS } from 'codecrafters-frontend/utils/code-mirror-gutter-rs';
import { CollapsedRangesWidget, uncollapseRangesStateEffect } from 'codecrafters-frontend/utils/code-mirror-collapse-ranges';

function renderGutterElement(view: EditorView, widget: WidgetType, line: BlockInfo) {
  const totalLines = view.state.doc.lines;
  const lineNumber = view.state.doc.lineAt(line.from).number;
  const collapsedLinesCount = widget instanceof CollapsedRangesWidget ? widget.lines : 1;
  const extraClassNames = [];

  if (lineNumber === 1) {
    extraClassNames.push('cm-collapseRangesGutterElementFirst');
  } else if (lineNumber + collapsedLinesCount - 1 >= totalLines) {
    extraClassNames.push('cm-collapseRangesGutterElementLast');
  }

  const el = document.createElement('div');
  el.className = ['cm-collapseRangesGutterElement', ...extraClassNames].join(' ');
  el.addEventListener('click', function dispatchUncollapseRangesStateEffect() {
    view.dispatch({ effects: uncollapseRangesStateEffect.of(line.from) });
  });

  return el;
}

export class CollapseRangesGutterMarker extends GutterMarker {
  line: BlockInfo;
  view: EditorView;
  widget: WidgetType;

  constructor(view: EditorView, widget: WidgetType, line: BlockInfo) {
    super();
    this.line = line;
    this.view = view;
    this.widget = widget;
  }

  toDOM(view: EditorView) {
    return renderGutterElement(view, this.widget, this.line);
  }
}

export class CollapseRangesGutterMarkerRS extends GutterMarkerRS {
  line: BlockInfo;
  view: EditorView;
  widget: WidgetType;

  constructor(view: EditorView, widget: WidgetType, line: BlockInfo) {
    super();
    this.line = line;
    this.view = view;
    this.widget = widget;
  }

  toDOM(view: EditorView) {
    return renderGutterElement(view, this.widget, this.line);
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
