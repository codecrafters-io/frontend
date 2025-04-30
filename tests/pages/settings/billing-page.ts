import { clickable, hasClass, visitable, collection, text } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  membershipSection: {
    scope: '[data-test-membership-section]',
  },

  paymentHistorySection: {
    charges: collection('[data-test-payment-history-item]', {
      amount: text('[data-test-amount]'),
      failed: hasClass('text-red-600'),
    }),
    scope: '[data-test-payment-history-section]',
  },

  supportSection: {
    clickOnContactButton: clickable('[data-test-support-contact-button]'),
    scope: '[data-test-support-section]',
  },

  visit: visitable('/settings/billing'),
});
