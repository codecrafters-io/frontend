import { clickable, collection, fillable, property, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  campusProgramApplicationModal: {
    clickOnVerifyEmailButton: clickable('[data-test-verify-email-button]'),
    emailAddressInputPlaceholder: property('placeholder', '#email_address_input'),
    fillInEmailAddress: fillable('#email_address_input'),
    verifyEmailButtonIsDisabled: property('disabled', '[data-test-verify-email-button]'),

    scope: '[data-test-campus-program-application-modal]',
  },

  claimOfferButtons: collection('[data-test-claim-offer-button]'),
  visit: visitable('/institutions/:institution_slug'),
});
