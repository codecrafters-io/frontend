import { clickOnText, clickable, fillable, isVisible } from 'ember-cli-page-object';
import billingStatusBadge from './billing-status-badge';

export default {
  clickOnHeaderLink: clickOnText('[data-test-header-link]'),

  discountTimerBadge: billingStatusBadge.discountTimerBadge,

  feedbackDropdown: {
    clickOnSendButton: clickable('[data-test-send-button]'),
    fillInExplanation: fillable('textarea'),
    isOpen: isVisible('[data-test-feedback-dropdown-content]', { resetScope: true }),
    resetScope: true,
    sendButtonIsVisible: isVisible('[data-test-send-button]'),
    scope: '[data-test-feedback-dropdown-content]',
    toggle: clickable('[data-test-feedback-button]', { resetScope: true }),
  },

  freeWeeksLeftButton: billingStatusBadge.freeWeeksLeftButton,

  memberBadge: billingStatusBadge.memberBadge,

  scope: '[data-test-header]',

  upgradeButton: billingStatusBadge.upgradeButton,

  vipBadge: billingStatusBadge.vipBadge,
};
