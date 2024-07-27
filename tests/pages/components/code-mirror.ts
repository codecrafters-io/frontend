import { blurrable, clickable, collection, create, fillable, focusable, text } from 'ember-cli-page-object';
import { alias } from 'ember-cli-page-object/macros';

export default create({
  scope: '[data-test-code-mirror-component]',
  componentText: text(),

  editor: {
    scope: '> .cm-editor',
    scroller: {
      scope: '> .cm-scroller',
      content: {
        scope: '> .cm-content',
        text: text(),
        focus: focusable(),
        blur: blurrable(),
        lines: collection('> .cm-line', {
          click: clickable(),
          fillIn: fillable(),
        }),
      },
    },
  },

  content: alias('editor.scroller.content'),

  hasRendered: alias('content.isPresent'),
  text: alias('content.text'),
});
