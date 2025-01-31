import { clickOnText, clickable, fillable, isVisible } from 'ember-cli-page-object';
import BillingStatusBadge from 'codecrafters-frontend/tests/pages/components/billing-status-badge';

export default {
  clickOnHeaderLink: clickOnText('[data-test-header-link]'),

  discountTimerBadge: BillingStatusBadge.discountTimerBadge,

  feedbackDropdown: {
    clickOnSendButton: clickable('[data-test-send-button]'),
    fillInExplanation: fillable('textarea'),
    isOpen: isVisible('[data-test-feedback-dropdown-content]', { resetScope: true }),
    resetScope: true,
    sendButtonIsVisible: isVisible('[data-test-send-button]'),
    scope: '[data-test-feedback-dropdown-content]',
    toggle: clickable('[data-test-feedback-button]', { resetScope: true }),
  },

  freeWeeksLeftButton: BillingStatusBadge.freeWeeksLeftButton,

  memberBadge: BillingStatusBadge.memberBadge,

  scope: '[data-test-header]',

  upgradeButton: BillingStatusBadge.upgradeButton,

  vipBadge: BillingStatusBadge.vipBadge,
};
