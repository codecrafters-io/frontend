import { clickable, collection, create, text, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default create({
  accountDropdown: AccountDropdown,

  clickOnApplyRegionalDiscountButton: clickable('[data-test-apply-regional-discount-button]'),
  clickOnChoosePlanButton: clickable('[data-test-choose-plan-button]'),
  clickOnExtraInvoiceDetailsToggle: clickable('[data-test-extra-invoice-details-toggle]'),
  clickOnProceedToCheckoutButton: clickable('[data-test-proceed-to-checkout-button]'),

  discountNotice: {
    scope: '[data-test-discount-notice]',
  },

  header: Header,

  membershipPlanCards: collection('[data-test-membership-plan-cards] > *', {
    ctaButton: {
      scope: '[data-test-pricing-plan-card-cta]',
    },
  }),

  modalPlanCards: collection('[data-test-modal-plan-card]', {
    click: clickable(),
    discountedPriceText: text('[data-test-discounted-price]'),
  }),

  referralDiscountNotice: {
    scope: '[data-test-referral-discount-notice]',
  },

  regionalDiscountNotice: {
    scope: '[data-test-modal-regional-discount-notice]',
  },

  signupDiscountNotice: {
    scope: '[data-test-signup-discount-notice]',
  },

  visit: visitable('/pay'),
});
