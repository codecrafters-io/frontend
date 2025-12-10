import { text, visitable, hasClass, triggerable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  visit: visitable('/gifts/redeem/:secret_token'),

  giftRedeemedMessage: { scope: '[data-test-gift-redeemed-message]' },
  giftMessageContainer: { scope: '[data-test-gift-message-container]' },

  giftDetailsContainer: {
    giftMessage: text('[data-test-gift-message]'),
    scope: '[data-test-gift-details-container]',
  },

  redeemButton: {
    scope: '[data-test-redeem-button]',
    isDisabled: hasClass('cursor-not-allowed'),
    hover: triggerable('mouseenter'),
  },
});
