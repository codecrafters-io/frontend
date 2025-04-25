import { clickable, hasClass, isVisible, visitable, attribute, collection, text } from 'ember-cli-page-object';
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
    charges: collection('[data-test-payment-history-item]', {
      amount: text('[data-test-amount]'),
      failed: hasClass('text-red-600'),
    }),
  },

  supportSection: {
    scope: '[data-test-support-section]',
    isVisible: isVisible(),
    clickOnContactButton: clickable('[data-test-support-contact-button]'),
  },

  visit: visitable('/settings/billing'),
});
