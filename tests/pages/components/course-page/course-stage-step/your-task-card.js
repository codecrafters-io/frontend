import { attribute, clickable, clickOnText, isVisible, text } from 'ember-cli-page-object';

export default {
  clickOnActionButton: clickOnText('[data-test-action-button]'),
  footerText: text('[data-test-footer-text]'),

  feedbackPrompt: {
    clickOnOption: clickOnText('[data-test-feedback-prompt-option]'),
    clickOnSubmitButton: clickable('button'),
    explanationTextareaPlaceholder: attribute('placeholder', 'textarea'),
    questionText: text('[data-test-question-text]'),
    scope: '[data-test-feedback-prompt]',
  },

  hasFeedbackPrompt: isVisible('[data-test-feedback-prompt]'),

  scope: '[data-test-your-task-card]',
};
