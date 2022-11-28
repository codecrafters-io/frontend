import { clickable, collection, create, text, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default create({
  accountDropdown: AccountDropdown,
  clickOnStartPaymentButtonForMonthlyPlan: clickable('[data-test-monthly-pricing-card] [data-test-start-payment-button]'),
  header: Header,

  pricingCards: collection('[data-test-pricing-card]', {
    discountedPriceText: text('[data-test-discounted-price]'),
  }),

  visit: visitable('/pay'),
});
