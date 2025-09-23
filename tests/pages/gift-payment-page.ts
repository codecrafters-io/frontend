import { clickable, fillable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  enterDetailsStepContainer: {
    clickOnContinueButton: clickable('[data-test-continue-button]'),
    fillInSenderEmailAddress: fillable('#sender_email_address_input'),
    fillInGiftMessage: fillable('#gift_message_input'),
    scope: '[data-test-enter-details-step-container]',
  },

  // paymentDetailsStepContainer: {
  //   clickOnContinueButton: clickable('[data-test-continue-button]'),
  //   scope: '[data-test-payment-details-step-container]',
  // },

  // reviewPaymentStepContainer: {
  //   scope: '[data-test-review-payment-step-container]',
  // },

  visit: visitable('/gifts/buy'),
});
