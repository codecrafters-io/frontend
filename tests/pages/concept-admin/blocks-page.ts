import { clickable, collection, create, fillable, property, text, visitable } from 'ember-cli-page-object';

export default create({
  clickOnPublishChangesButton: clickable('[data-test-publish-changes-button]'),

  insertBlockMarkers: collection('[data-test-insert-block-marker]', {
    dropdown: {
      async clickOnItem(title: string) {
        await Array.from(this.items)
          .find((item) => item.title.trim() === title)!
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
    click: clickable('[data-test-clickable-area]'),
    clickOnSaveButton: clickable('[data-test-save-button]'),
    clickOnDeleteButton: clickable('[data-test-delete-button]'),

    conceptQuestionBlockEditor: {
      selectQuestion: fillable('select'),
      dropdownOptions: collection('[data-test-concept-question-block-editor-dropdown-option]', {
        isDisabled: property('disabled'),
      }),
      clickOnNewQuestionButton: clickable('[data-test-concept-question-block-editor-new-question-button]'),
      scope: '[data-test-concept-question-block-editor]',
    },

    markdownBlockEditor: {
      fillInMarkdown: fillable('textarea'),
      scope: '[data-test-markdown-block-editor]',
    },

    preview: {
      scope: '[data-test-editable-block-preview]',
    },
  }),

  visit: visitable('/concepts/:concept_slug/admin/blocks'),
});
