import { clickable, collection, create, text, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default create({
  accountDropdown: AccountDropdown,
  header: Header,

  pricingPlanCards: collection('[data-test-pricing-plan-card]', {
    ctaButton: {
      scope: '[data-test-pricing-plan-card-cta]',
    },
  }),

  chooseMembershipPlanModal: {
    scope: '[data-test-choose-membership-plan-modal]',
    clickOnChoosePlanButton: clickable('[data-test-choose-plan-button]'),
    clickOnExtraInvoiceDetailsToggle: clickable('[data-test-extra-invoice-details-toggle]'),
    clickOnProceedToCheckoutButton: clickable('[data-test-proceed-to-checkout-button]'),
    planCards: collection('[data-test-plan-card]', {
      discountedPriceText: text('[data-test-discounted-price]'),
      discountNotice: {
        scope: '[data-test-discount-notice]',
      },
      regionalDiscountNotice: {
        scope: '[data-test-regional-discount-notice]',
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
