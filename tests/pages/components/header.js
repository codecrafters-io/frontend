import { clickOnText, collection, clickable, fillable, isVisible } from 'ember-cli-page-object';
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

  hasLink: function (linkText) {
    return !!this.links.toArray().find((link) => link.text === linkText);
  },

  freeWeeksLeftButton: BillingStatusBadge.freeWeeksLeftButton,
  links: collection('[data-test-header-link]'),
  memberBadge: BillingStatusBadge.memberBadge,

  scope: '[data-test-header]',

  signInButton: {
    scope: '[data-test-sign-in-with-github-button]',
  },

  upgradeButton: BillingStatusBadge.upgradeButton,

  vipBadge: BillingStatusBadge.vipBadge,
};
