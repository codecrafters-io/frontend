import { clickable, collection, isVisible, text } from 'ember-cli-page-object';

export default {
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
};
