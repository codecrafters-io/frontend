import { attribute, clickable, collection, fillable, isPresent, text, triggerable } from 'ember-cli-page-object';

export default {
  betaLabelText: text('[data-test-chat-beta-label]'),
  clickOnAskButton: clickable('[data-test-chat-submit-button]'),
  clickOnRatingDown: clickable('[data-test-rating-down]'),
  clickOnRatingUp: clickable('[data-test-rating-up]'),
  clickOnToggle: clickable('[data-test-chat-toggle]'),
  fillInBody: fillable('[data-test-chat-input]'),
  isExpanded: isPresent('[data-test-chat-composer]'),
  keydownOnInput: triggerable('keydown', '[data-test-chat-input]'),

  messages: collection('[data-test-chat-message]', {
    body: text('[data-test-chat-message-body]'),
    role: attribute('data-test-chat-message-role'),
  }),

  scope: '[data-test-course-stage-chat-panel]',
  submitError: text('[data-test-chat-submit-error]'),
  title: text('[data-test-chat-title]'),
};
