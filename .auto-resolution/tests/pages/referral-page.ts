import { collection, text, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  getStartedButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-get-started-button]',
  },

  referralReferredUsersContainer: {
    durationPill: collection('[data-test-duration-pill]', {
      hover: triggerable('mouseenter'),
    }),

    scope: '[data-test-referral-referred-users-container]',
  },

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
