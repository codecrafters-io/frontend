import { attribute, clickable, clickOnText, text } from 'ember-cli-page-object';

export default {
  clickOnEditFeedbackButton: clickable('[data-test-edit-feedback-button]'),
  clickOnOption: clickOnText('[data-test-feedback-prompt-option]'),
  clickOnSubmitButton: clickable('[data-test-submit-feedback-button]'),
  explanationTextareaPlaceholder: attribute('placeholder', 'textarea'),
  questionText: text('[data-test-question-text]'),
  scope: '[data-test-feedback-prompt]',
};
