import { triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  acceptReferralButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-accept-referral-button]',
  },

  acceptedReferralNotice: {
    scope: '[data-test-accepted-referral-notice]',
  },

  visit: visitable('/r/:referral_link_slug'),
});
