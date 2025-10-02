import { clickable, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  visit: visitable('/gifts/redeem/:secret_token'),

  giftDetailsContainer: {
    claimButton: { scope: '[data-test-claim-button]' },
    giftMessage: text('[data-test-gift-message]'),
    scope: '[data-test-gift-details-container]',
  },

  clickClaimButton: clickable('[data-test-claim-button]'),
});
