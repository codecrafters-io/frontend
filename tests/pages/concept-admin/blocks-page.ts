import { clickable, collection, create, fillable, text, visitable } from 'ember-cli-page-object';

export default create({
  clickOnPublishChangesButton: clickable('[data-test-publish-changes-button]'),

  insertBlockMarkers: collection('[data-test-insert-block-marker]', {
    dropdown: {
      async clickOnItem(title: string) {
        // @ts-ignore
        await Array.from(this.items)
          // @ts-ignore
          .find((item) => item.title.trim() === title)
          .click();
      },

      items: collection('[data-test-insert-block-marker-dropdown-item]', {
        title: text('[data-test-title]'),
      }),

      scope: '[data-test-insert-block-marker-dropdown-content]',
      resetScope: true,
    },
  }),

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
