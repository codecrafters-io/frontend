import { attribute, clickable, collection, hasClass, text, visitable } from 'ember-cli-page-object';
import ChooseMembershipPlanModal from 'codecrafters-frontend/tests/pages/components/choose-membership-plan-modal';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  chooseMembershipPlanModal: ChooseMembershipPlanModal,

  membershipExtendedNotice: {
    scope: '[data-test-membership-extended-notice]',
    clickDismissButton: clickable('[data-test-dismiss-button]'),
  },

  membershipSection: {
    scope: '[data-test-membership-section]',
  },

  paymentHistorySection: {
    charges: collection('[data-test-payment-history-item]', {
      amount: text('[data-test-amount]'),
      failed: hasClass('text-red-600'),
      refundText: text('[data-test-refund-text]'),
    }),
    scope: '[data-test-payment-history-section]',
  },

  renewalSection: {
    explanationText: text('[data-test-explanation-text]'),
    extendMembershipButton: { scope: '[data-test-extend-membership-button]' },
    scope: '[data-test-renewal-section]',
  },

  supportSection: {
    scope: '[data-test-support-section]',
    contactButtonHref: attribute('href', '[data-test-support-contact-button]'),
  },

  visit: visitable('/settings/billing'),
});
