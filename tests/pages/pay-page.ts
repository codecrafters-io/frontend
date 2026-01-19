import { clickable, collection, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import ChooseMembershipPlanModal from 'codecrafters-frontend/tests/pages/components/choose-membership-plan-modal';
import Header from 'codecrafters-frontend/tests/pages/components/header';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  accountDropdown: AccountDropdown,
  chooseMembershipPlanModal: ChooseMembershipPlanModal,
  clickOnModalBackdrop: clickable('[data-test-modal-backdrop]'),
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
