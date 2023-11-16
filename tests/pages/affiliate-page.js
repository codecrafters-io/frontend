import { clickOnText, collection, text, visitable, clickable, triggerable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  createPayoutModal: {
    backToAffiliatePageButton: { scope: '[data-test-back-to-affiliate-page-button]' },
    clickOnPayoutMethodCard: clickOnText('[data-test-payout-method-card]'),
    paypalPayoutForm: {
      scope: '[data-test-paypal-payout-form]',
      amountInput: { scope: '#amount_input' },
      emailInput: { scope: '#paypal_email_input' },
      withdrawButton: { scope: '[data-test-withdraw-button]' },
    },
    scope: '[data-test-create-payout-modal]',
  },

  totalEarningsAmountText: text('[data-test-total-earnings-amount]'),

  lineItems: collection('[data-test-line-item]', {
    amountText: text('[data-test-line-item-amount]'),
    titleText: text('[data-test-line-item-title]'),
  }),

  lineItemAmountText(lineItemTitle) {
    return this.lineItems.toArray().find((lineItem) => lineItem.titleText === lineItemTitle).amountText;
  },

  getStartedButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-get-started-button]',
  },

  affiliateReferredUsersContainerText: text('[data-test-affiliate-referred-users-container]'),

  affiliateReferralStatsPaidUsersText: text('[data-test-affiliate-referral-stats-paid-users]'),

  clickShowAllButton: clickable('[data-test-affiliate-referred-users-show-all-button]'),

  initiatePayoutButton: {
    scope: '[data-test-initiate-payout-button]',
  },

  payoutHistoryItems: collection('[data-test-payout-history-item]'),

  visit: visitable('/partner'),
});
