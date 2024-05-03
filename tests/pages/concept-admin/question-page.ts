import { collection, clickable, create, fillable, visitable } from 'ember-cli-page-object';

export default create({
  clickOnPublishChangesButton: clickable('[data-test-publish-changes-button]'),
  clickOnAddOptionButton: clickable('[data-test-add-option-button]'),
  fillInQueryMarkdown: fillable('#question_query_markdown'),
  fillInSlug: fillable('#question_slug'),

  optionForms: collection('[data-test-option-form]', {
    clickOnDeleteButton: clickable('[data-test-delete-button]'),
    clickOnIsCorrectToggle: clickable('[data-test-is-correct-toggle]'),
    clickOnMoveDownButton: clickable('[data-test-move-down-button]'),
    clickOnMoveUpButton: clickable('[data-test-move-up-button]'),
    fillInMarkdown: fillable('#option_markdown'),
  }),

  visit: visitable('/concepts/:concept_slug/admin/questions/:question_slug'),
});
