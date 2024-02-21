import { clickable, clickOnText, collection, text, triggerable } from 'ember-cli-page-object';
import LeaderboardEntry from 'codecrafters-frontend/tests/pages/components/course-page/leaderboard-entry';

export default {
  entries: collection('[data-test-leaderboard-entry]', LeaderboardEntry),

  inviteButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-invite-button]',
  },

  scope: '[data-test-leaderboard]',

  teamDropdown: {
    toggle: clickable('[data-test-leaderboard-team-dropdown-trigger]', { resetScope: true }),
    clickOnLink: clickOnText('div[role="button"]'),

    hasLink(text) {
      return this.links.toArray().some((link) => link.text.includes(text));
    },

    links: collection('div[role="button"]', {
      text: text(),
    }),

    resetScope: true,
    scope: '[data-test-leaderboard-team-dropdown-content]',
  },
};
