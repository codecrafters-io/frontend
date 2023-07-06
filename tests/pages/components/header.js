import { clickable, clickOnText, fillable, isVisible } from 'ember-cli-page-object';

export default {
  feedbackDropdown: {
    clickOnSendButton: clickable('[data-test-send-button]'),
    fillInExplanation: fillable('textarea'),
    isOpen: isVisible('[data-test-feedback-dropdown-content]', { resetScope: true }),
    resetScope: true,
    sendButtonIsVisible: isVisible('[data-test-send-button]'),
    scope: '[data-test-feedback-dropdown-content]',
    toggle: clickable('[data-test-feedback-button]', { resetScope: true }),
  },

  clickOnHeaderLink: clickOnText('[data-test-header-link]'),
  scope: '[data-test-header]',
};
