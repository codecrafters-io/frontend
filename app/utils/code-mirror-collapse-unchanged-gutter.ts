import { EditorView, gutter, GutterMarker, type WidgetType } from '@codemirror/view';

function isCollapseUnchangedWidget(widget: WidgetType) {
  return 'type' in widget && widget.type === 'collapsed-unchanged-code';
}

function toDOM(_view: EditorView): Node {
  const el = document.createElement('div');
  el.className = 'cm-collapseUnchangedGutterElement';
  el.addEventListener('click', (_e) => {
    const editor = el.closest('.cm-editor');
    const gutter = el.closest('.cm-gutter');
    const gutterElement = el.closest('.cm-gutterElement');
    const gutterElementSiblings = gutter?.querySelectorAll('.cm-collapseUnchangedBarSibling');

    if (!editor || !gutter || !gutterElement || !gutterElementSiblings) {
      return;
    }

    // Find the index of the clicked gutter element
    const gutterElementIndex = [...gutterElementSiblings.values()].indexOf(gutterElement);

    // Find the corresponding Collapse Unchanged Bar in the content
    const collapsedUnchangedBar = editor.querySelectorAll<HTMLElement>('.cm-content .cm-collapsedLines').item(gutterElementIndex);

    collapsedUnchangedBar?.click();
  });

  return el;
}

export class CollapseUnchangedGutterMarker extends GutterMarker {
  elementClass = 'cm-collapseUnchangedBarSibling';
  toDOM = toDOM;
}

export function collapseUnchangedGutter() {
  return [
    gutter({
      class: 'cm-collapseUnchangedGutter',
      renderEmptyElements: true,
      widgetMarker(_view, widget, _block) {
        return isCollapseUnchangedWidget(widget) ? new CollapseUnchangedGutterMarker() : null;
      },
    }),
  ];
}
