import { visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  getStartedButton: {
    scope: '[data-test-get-started-button]',
  },

  initiatePayoutButton: {
    scope: '[data-test-initiate-payout-button]',
  },

  visit: visitable('/refer'),
});
