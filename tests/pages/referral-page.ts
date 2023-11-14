import { text, visitable, clickable, triggerable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  getStartedButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-get-started-button]',
  },

  referredUsersContainerText: text('[data-test-referred-users-container]'),
  referralStatsReferralsText: text('[data-test-referral-stats-referrals]'),
  referralStatsFreeWeeksLeft: {
    count: text('[data-test-referral-stats-free-weeks-left-count]'),
    scope: '[data-test-referral-stats-free-weeks-left]',
  },

  clickShowAllButton: clickable('[data-test-referred-users-show-all-button]'),

  visit: visitable('/refer'),
});
