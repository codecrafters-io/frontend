import createPage from 'codecrafters-frontend/tests/support/create-page';
import { clickable, collection, fillable, hasClass, property, visitable } from 'ember-cli-page-object';

export default createPage({
  campusProgramApplicationModal: {
    enterEmailStepContainer: {
      clickOnVerifyEmailButton: clickable('[data-test-verify-email-button]'),
      emailAddressInputPlaceholder: property('placeholder', '#email_address_input'),
      fillInEmailAddress: fillable('#email_address_input'),
      scope: '[data-test-enter-email-step-container]',
      verifyEmailButtonIsDisabled: hasClass('cursor-not-allowed', '[data-test-verify-email-button]'),
    },

    verifyEmailStepContainer: {
      scope: '[data-test-verify-email-step-container]',
    },

    scope: '[data-test-campus-program-application-modal]',
  },

  claimOfferButtons: collection('[data-test-claim-offer-button]'),
  visit: visitable('/institutions/:institution_slug'),
});
