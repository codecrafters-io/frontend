import { fillIn } from '@ember/test-helpers';
import EvaluationCard from 'codecrafters-frontend/tests/pages/components/course-admin/code-examples-page/evaluation-card';
import { clickable, collection, create, fillable, hasClass, text, value, visitable } from 'ember-cli-page-object';

export default create({
  evaluationsSection: {
    evaluationCards: collection('[data-test-evaluation-card]', EvaluationCard),
    scope: '[data-test-evaluations-section]',

    scrollIntoView() {
      return document.querySelector(this.scope)!.scrollIntoView();
    },
  },

  promptTemplateSection: {
    scope: '[data-test-prompt-template-section]',
    textareaValue: value('#prompt_template'),
    clickOnUpdateButton: clickable('[data-test-update-prompt-template-button]'),
    isUpdateButtonDisabled: hasClass('opacity-40', '[data-test-update-prompt-template-button]'),

    async fillTextarea(newText: string) {
      await fillIn('#prompt_template', newText);
    },
  },

  slugField: {
    clickOnDisplay: clickable('[data-test-editable-text-field-display]'),
    clickOnConfirmButton: clickable('[data-test-editable-text-field-confirm-button]'),
    clickOnCancelButton: clickable('[data-test-editable-text-field-cancel-button]'),
    fillInput: fillable('[data-test-editable-text-field-input]'),
    inputValue: text('[data-test-editable-text-field-input]'),
  },

  visit: visitable('/courses/:course_slug/admin/code-example-evaluators/:evaluator_slug'),
});
