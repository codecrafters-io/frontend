import { clickable, collection, create, isVisible, text, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default create({
  accountDropdown: AccountDropdown,
  clickOnModalBackdrop: clickable('[data-test-modal-backdrop]'),

  chooseMembershipPlanModal: {
    scope: '[data-test-choose-membership-plan-modal]',
    clickOnBackToPricingPageLink: clickable('[data-test-back-to-pricing-page-link]'),
    clickOnChoosePlanButton: clickable('[data-test-choose-plan-button]'),
    clickOnExtraInvoiceDetailsToggle: clickable('[data-test-extra-invoice-details-toggle]'),
    clickOnProceedToCheckoutButton: clickable('[data-test-proceed-to-checkout-button]'),
    isVisible: isVisible(),
    planCards: collection('[data-test-plan-card]', {
      discountedPriceText: text('[data-test-discounted-price]'),

      promotionalDiscountNotice: {
        scope: '[data-test-promotional-discount-notice]',
      },

      regionalDiscountNotice: {
        scope: '[data-test-regional-discount-notice]',
      },
    }),
  },

  header: Header,

  pageRegionalDiscountNotice: {
    scope: '[data-test-regional-discount-notice]',
  },

  pricingPlanCards: collection('[data-test-pricing-plan-card]', {
    ctaButton: {
      scope: '[data-test-pricing-plan-card-cta]',
    },
  }),

  referralDiscountNotice: {
    scope: '[data-test-referral-discount-notice]',
  },

  signupDiscountNotice: {
    scope: '[data-test-signup-discount-notice]',
  },

  stage2CompletionDiscountNotice: {
    scope: '[data-test-stage-2-completion-discount-notice]',
  },

  visit: visitable('/pay'),
});
