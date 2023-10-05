import { clickable, collection, create, fillable, visitable } from 'ember-cli-page-object';

export default create({
  editableBlocks: collection('[data-test-editable-block]', {
    clickOnSaveButton: clickable('[data-test-save-button]'),
    clickOnDeleteButton: clickable('[data-test-delete-button]'),

    markdownBlockEditor: {
      fillInMarkdown: fillable('textarea'),
      scope: '[data-test-markdown-block-editor]',
    },
  }),

  visit: visitable('/concepts/:concept_slug/admin/blocks'),
});
