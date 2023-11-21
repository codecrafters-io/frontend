import { text, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  referralStatsReferrals: {
    infoIcon: {
      hover: triggerable('mouseenter'),
      scope: '[data-test-info-icon]',
    },

    scope: '[data-test-referral-stats-referrals]',
  },

  referralStatsFreeWeeksLeft: {
    countText: text('[data-test-referral-stats-free-weeks-left-count]'),

    infoIcon: {
      hover: triggerable('mouseenter'),
      scope: '[data-test-info-icon]',
    },

    scope: '[data-test-referral-stats-free-weeks-left]',
  },

  visit: visitable('/refer'),
});
