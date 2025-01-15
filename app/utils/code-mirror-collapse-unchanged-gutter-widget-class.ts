import { EditorView, gutter, GutterMarker, gutterWidgetClass } from '@codemirror/view';

export class CollapseUnchangedGutterMarker extends GutterMarker {
  elementClass = 'cm-collapseUnchangedBarNeighbor';

  toDOM(_view: EditorView): Node {
    const el = document.createElement('div');
    el.className = 'cm-collapseUnchangedBarGutterElement';
    el.addEventListener('click', (_e) => {
      const editor = el.closest('.cm-editor');
      const gutter = el.closest('.cm-gutter');
      const gutterElement = el.closest('.cm-gutterElement');
      const gutterElementSiblings = gutter?.querySelectorAll('.cm-collapseUnchangedBarNeighbor');

      if (!editor || !gutter || !gutterElement || !gutterElementSiblings) {
        return;
      }

      // Find the index of the clicked gutter element
      const gutterElementIndex = [...gutterElementSiblings.values()].indexOf(gutterElement);

      // Find the corresponding expand unchanged bar in the content
      const expandCollapsedBar = editor.querySelectorAll<HTMLElement>('.cm-content .cm-collapsedLines').item(gutterElementIndex);

      expandCollapsedBar?.click();
    });

    return el;
  }
}

export function collapseUnchangedGutterWidgetClass() {
  return [
    gutter({
      class: 'cm-collapseUnchangedBarGutter',
      renderEmptyElements: true,
      widgetMarker(_view, widget, _block) {
        if ('type' in widget && widget.type === 'collapsed-unchanged-code') {
          return new CollapseUnchangedGutterMarker();
        }

        return null;
      },
    }),
  ];
}
