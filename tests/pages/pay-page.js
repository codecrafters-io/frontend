import { clickable, collection, create, text, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default create({
  accountDropdown: AccountDropdown,

  clickOnChoosePlanButton: clickable('[data-test-choose-plan-button]'),
  clickOnExtraInvoiceDetailsToggle: clickable('[data-test-extra-invoice-details-toggle]'),
  clickOnProceedToCheckoutButton: clickable('[data-test-proceed-to-checkout-button]'),

  discountNotice: {
    scope: '[data-test-discount-notice]',
  },

  header: Header,

  pricingPlanCards: collection('[data-test-pricing-plan-card]', {
    ctaButton: {
      scope: '[data-test-pricing-plan-card-cta]',
    },
  }),

  chooseMembershipPlanModal: {
    planCards: collection('[data-test-modal-plan-card]', {
      discountedPriceText: text('[data-test-discounted-price]'),
      regionalDiscountNotice: {
        scope: '[data-test-modal-regional-discount-notice]',
      },
    }),
  },

  referralDiscountNotice: {
    scope: '[data-test-referral-discount-notice]',
  },

  signupDiscountNotice: {
    scope: '[data-test-signup-discount-notice]',
  },

  visit: visitable('/pay'),
});
