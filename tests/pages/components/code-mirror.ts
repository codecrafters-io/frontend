import { blurrable, clickable, collection, create, fillable, focusable, text } from 'ember-cli-page-object';
import { alias } from 'ember-cli-page-object/macros';

export default create({
  scope: '[data-test-code-mirror-component]',

  editor: {
    scope: '> .cm-editor',

    scroller: {
      scope: '> .cm-scroller',

      gutters: {
        scope: '> .cm-gutters',
        allGutters: collection('> .cm-gutter'),

        lineNumbers: {
          scope: '> .cm-gutter.cm-lineNumbers',
          elements: collection('> .cm-gutterElement'),
        },

        foldGutter: {
          scope: '> .cm-gutter.cm-foldGutter',
          elements: collection('> .cm-gutterElement'),
        },

        changeGutter: {
          scope: '> .cm-gutter.cm-changeGutter',
          elements: collection('> .cm-gutterElement'),
        },
      },

      content: {
        scope: '> .cm-content',
        text: text(),
        focus: focusable(),
        blur: blurrable(),

        collapsedLinesPlaceholders: collection('> .cm-collapsedLines', {
          text: text(),
          click: clickable(),
        }),

        lines: collection('> .cm-line', {
          text: text(),
          click: clickable(),
          fillIn: fillable(),
        }),

        changedLines: collection('> .cm-changedLine', {
          text: text(),
          click: clickable(),
          fillIn: fillable(),
        }),

        deletedChunks: collection('> .cm-deletedChunk', {
          text: text(),
        }),
      },
    },
  },

  componentText: text(),

  content: alias('editor.scroller.content'),
  gutters: alias('editor.scroller.gutters'),

  text: alias('content.text'),
  hasRendered: alias('content.isPresent'),

  async setLineText(lineNumber: number, newContent?: string) {
    await this.content.focus();
    await this.content.lines.objectAt(lineNumber).click();
    await this.content.lines.objectAt(lineNumber).fillIn(newContent);
    await this.content.blur();
  },
});
