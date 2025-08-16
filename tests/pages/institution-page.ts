import createPage from 'codecrafters-frontend/tests/support/create-page';
import { clickable, collection, fillable, hasClass, property, text, triggerable, visitable } from 'ember-cli-page-object';

export default createPage({
  campusProgramApplicationModal: {
    enterEmailStepContainer: {
      clickOnVerifyEmailButton: clickable('[data-test-verify-email-button]'),
      emailAddressInputPlaceholder: property('placeholder', '#email_address_input'),
      emailAddressInputValue: property('value', '#email_address_input'),
      fillInEmailAddress: fillable('#email_address_input'),
      scope: '[data-test-enter-email-step-container]',
      verifyEmailButtonIsDisabled: hasClass('cursor-not-allowed', '[data-test-verify-email-button]'),
    },

    verifyEmailStepContainer: {
      clickOnChangeEmailButton: clickable('[data-test-change-email-button]'),
      clickOnResendEmailButton: clickable('[data-test-resend-email-button]'),
      emailAddress: text('[data-test-email-address]'),
      scope: '[data-test-verify-email-step-container]',
    },

    scope: '[data-test-campus-program-application-modal]',
  },

  claimOfferButtons: collection('[data-test-claim-offer-button]', {
    hover: triggerable('mouseenter'),
  }),
  visit: visitable('/campus/:institution_slug'),
});
