import { clickable, collection, create, fillable, visitable } from 'ember-cli-page-object';

export default create({
  editableBlocks: collection('[data-test-editable-block]', {
    clickOnCloseEditorButton: clickable('[data-test-close-editor-button]'),
    clickOnUpdateBlockButton: clickable('[data-test-update-block-button]'),

    markdownBlockEditor: {
      fillInMarkdown: fillable('textarea'),
      scope: '[data-test-markdown-block-editor]',
    },
  }),

  visit: visitable('/concepts/:concept_slug/admin/blocks'),
});
