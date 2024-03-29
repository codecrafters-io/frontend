import { blurrable, clickable, fillable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  teamDetailsStepContainer: {
    clickOnContinueButton: clickable('[data-test-continue-button]'),
    blurContactEmailInput: blurrable('#contact_email_input'),
    fillInTeamName: fillable('#team_name_input'),
    fillInContactEmail: fillable('#contact_email_input'),
    scope: '[data-test-team-details-step-container]',
  },

  paymentDetailsStepContainer: {
    clickOnContinueButton: clickable('[data-test-continue-button]'),
    scope: '[data-test-payment-details-step-container]',
  },

  reviewPaymentStepContainer: {
    scope: '[data-test-review-payment-step-container]',
  },

  visit: visitable('/teams/pay'),
});
