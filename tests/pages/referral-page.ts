import { visitable, triggerable, text } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  getStartedButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-get-started-button]',
  },

  referralStatsReferralsText: text('[data-test-referral-stats-referrals]'),

  referralStatsFreeWeeksLeft: {
    countText: text('[data-test-referral-stats-free-weeks-left-count]'),
    scope: '[data-test-referral-stats-free-weeks-left]',
  },

  visit: visitable('/refer'),
});
