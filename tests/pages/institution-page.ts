import { collection, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  campusProgramApplicationModal: {
    scope: '[data-test-campus-program-application-modal]',
  },

  claimOfferButtons: collection('[data-test-claim-offer-button]'),
  visit: visitable('/institutions/:institution_slug'),
});
