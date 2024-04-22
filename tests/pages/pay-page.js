import { clickable, collection, create, text, triggerable, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default create({
  accountDropdown: AccountDropdown,
  clickOnApplyRegionalDiscountButton: clickable('[data-test-apply-regional-discount-button]'),
  clickOnExtraInvoiceDetailsToggle: clickable('[data-test-extra-invoice-details-toggle]'),
  clickOnProceedToCheckoutButton: clickable('[data-test-proceed-to-checkout-button]'),
  clickOnStartPaymentButtonForMonthlyPlan: clickable('[data-test-monthly-pricing-card] [data-test-start-payment-button]'),
  clickOnStartPaymentButtonForYearlyPlan: clickable('[data-test-yearly-pricing-card] [data-test-start-payment-button]'),
  header: Header,

  pricingCards: collection('[data-test-pricing-card]', {
    discountedPriceText: text('[data-test-discounted-price]'),

    startPaymentButton: {
      hover: triggerable('mouseenter'),
      scope: '[data-test-start-payment-button]',
    },
  }),

  visit: visitable('/pay'),
});
