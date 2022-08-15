import { collection, clickable, clickOnText, create, fillable, hasClass, text, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default create({
  accountDropdown: AccountDropdown,

  cancelSubscriptionModal: {
    selectReason: clickOnText('label'),
    cancelButtonIsDisabled: hasClass('cursor-not-allowed', '[data-test-cancel-subscription-button]'),
    cancelButtonText: text('[data-test-cancel-subscription-button]'),
    clickOnCancelSubscriptionButton: clickable('[data-test-cancel-subscription-button]'),
    fillInReasonDescription: fillable('[data-test-reason-description-input]'),
    scope: '[data-test-cancel-subscription-modal]',
  },

  clickOnCancelSubscriptionButton: clickable('[data-test-cancel-subscription-button]'),
  clickOnCancelTrialButton: clickable('[data-test-cancel-trial-button]'),
  clickOnUpdatePaymentMethodButton: clickable('[data-test-update-payment-method-button]'),

  membershipPlanSection: {
    descriptionText: text('[data-test-membership-plan-description]'),
    scope: '[data-test-membership-plan-section]',
  },

  recentPaymentsSection: {
    downloadInvoiceLinks: collection('[data-test-download-invoice-link]'),
    scope: '[data-test-recent-payments-section]',
  },

  header: Header,
  visit: visitable('/membership'),
});
