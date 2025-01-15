import { BlockInfo, EditorView, gutter, GutterMarker, type WidgetType } from '@codemirror/view';
import { uncollapseUnchanged } from '@codemirror/merge';
import { gutter as gutterRS, GutterMarker as GutterMarkerRS } from 'codecrafters-frontend/utils/code-mirror-gutter-rs';

function isCollapseUnchangedWidget(widget: WidgetType) {
  return 'type' in widget && widget.type === 'collapsed-unchanged-code';
}

function renderGutterElement(view: EditorView, widget: WidgetType, line: BlockInfo) {
  const totalLines = view.state.doc.lines;
  const lineNumber = view.state.doc.lineAt(line.from).number;
  const collapsedLinesCount = 'lines' in widget ? (widget.lines as number) : 1;
  const extraClassNames = [];

  if (lineNumber === 1) {
    extraClassNames.push('cm-collapseUnchangedGutterElementFirst');
  } else if (lineNumber + collapsedLinesCount - 1 >= totalLines) {
    extraClassNames.push('cm-collapseUnchangedGutterElementLast');
  }

  const el = document.createElement('div');
  el.className = ['cm-collapseUnchangedGutterElement', ...extraClassNames].join(' ');
  el.addEventListener('click', function dispatchUncollapseUnchanged() {
    view.dispatch({ effects: uncollapseUnchanged.of(line.from) });
  });

  return el;
}

export class CollapseUnchangedGutterMarker extends GutterMarker {
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

export class CollapseUnchangedGutterMarkerRS extends GutterMarkerRS {
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

export function collapseUnchangedGutter() {
  return [
    gutter({
      class: 'cm-collapseUnchangedGutter',

      widgetMarker(view, widget, line) {
        return isCollapseUnchangedWidget(widget) ? new CollapseUnchangedGutterMarker(view, widget, line) : null;
      },
    }),

    gutterRS({
      class: 'cm-collapseUnchangedGutter',

      widgetMarker(view, widget, line) {
        return isCollapseUnchangedWidget(widget) ? new CollapseUnchangedGutterMarkerRS(view, widget, line) : null;
      },
    }),
  ];
}
