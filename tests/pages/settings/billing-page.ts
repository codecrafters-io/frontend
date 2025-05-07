import { hasClass, visitable, collection, text, attribute } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  membershipSection: {
    scope: '[data-test-membership-section]',
  },

  paymentHistorySection: {
    charges: collection('[data-test-payment-history-item]', {
      amount: text('[data-test-amount]'),
      failed: hasClass('text-red-600'),
      refundText: text('[data-test-refund-text]'),
    }),
    emptyStateText: text('> div:last-child'),
    scope: '[data-test-payment-history-section]',
  },

  supportSection: {
    scope: '[data-test-support-section]',
    contactButtonHref: attribute('href', '[data-test-support-contact-button]'),
  },

  visit: visitable('/settings/billing'),
});
