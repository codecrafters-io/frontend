import { attribute, clickOnText, collection } from 'ember-cli-page-object';
import BillingStatusBadge from 'codecrafters-frontend/tests/pages/components/billing-status-badge';
import FeedbackDropdown from 'codecrafters-frontend/tests/pages/components/feedback-dropdown';

export default {
  campusBadge: BillingStatusBadge.campusBadge,
  clickOnHeaderLink: clickOnText('[data-test-header-link]'),
  discountTimerBadge: BillingStatusBadge.discountTimerBadge,
  feedbackDropdown: FeedbackDropdown,

  hasLink: function (linkText: string) {
    return !![...this.links].find((link) => link.text === linkText);
  },

  freeWeeksLeftButton: BillingStatusBadge.freeWeeksLeftButton,

  links: collection('[data-test-header-link]', {
    href: attribute('href'),
  }),

  linkHrefFor: function (linkText: string) {
    return [...this.links].find((link) => link.text === linkText)!.href;
  },

  memberBadge: BillingStatusBadge.memberBadge,
  scope: '[data-test-header]',

  signInButton: {
    scope: '[data-test-sign-in-with-github-button]',
  },

  upgradeButton: BillingStatusBadge.upgradeButton,
  vipBadge: BillingStatusBadge.vipBadge,
};
