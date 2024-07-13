import { visitable, collection } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  acceptReferralButtons: collection('[data-test-accept-referral-button]'),

  visit: visitable('/join'),
});
