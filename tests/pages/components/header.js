import { clickable, clickOnText, fillable, isVisible, triggerable } from 'ember-cli-page-object';

export default {
  clickOnHeaderLink: clickOnText('[data-test-header-link]'),

  feedbackDropdown: {
    clickOnSendButton: clickable('[data-test-send-button]'),
    fillInExplanation: fillable('textarea'),
    isOpen: isVisible('[data-test-feedback-dropdown-content]', { resetScope: true }),
    resetScope: true,
    sendButtonIsVisible: isVisible('[data-test-send-button]'),
    scope: '[data-test-feedback-dropdown-content]',
    toggle: clickable('[data-test-feedback-button]', { resetScope: true }),
  },

  freeWeeksLeftButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-free-weeks-left-button]',
  },

  scope: '[data-test-header]',

  upgradeButton: {
    scope: '[data-test-upgrade-button]',
  },

  vipBadge: {
    scope: '[data-test-vip-badge]',
  },
};
