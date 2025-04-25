import { clickable, hasClass, isVisible, visitable, attribute } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  membershipSection: {
    scope: '[data-test-membership-section]',
    hasActivePlan: hasClass('has-active-plan'),
    isVisible: isVisible(),
    hasVipAccess: hasClass('has-vip-access'),
  },

  paymentHistorySection: {
    scope: '[data-test-payment-history-section]',
    isVisible: isVisible(),
    isEmpty: attribute('data-test-empty-state'),
  },

  supportSection: {
    scope: '[data-test-support-section]',
    isVisible: isVisible(),
    clickContactButton: clickable('[data-test-support-contact-button]'),
  },

  visit: visitable('/settings/billing'),
});
