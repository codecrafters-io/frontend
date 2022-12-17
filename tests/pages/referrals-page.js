import { clickOnText, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  createPayoutModal: {
    clickOnPayoutMethodCard: clickOnText('[data-test-payout-method-card]'),
    paypalPayoutForm: {
      scope: '[data-test-paypal-payout-form]',
      amountInput: { scope: '#amount_input' },
      emailInput: { scope: '#paypal_email_input' },
      withdrawButton: { scope: '[data-test-withdraw-button]' },
    },
    scope: '[data-test-create-payout-modal]',
  },

  getStartedButton: {
    scope: '[data-test-get-started-button]',
  },

  initiatePayoutButton: {
    scope: '[data-test-initiate-payout-button]',
  },

  visit: visitable('/refer'),
});
