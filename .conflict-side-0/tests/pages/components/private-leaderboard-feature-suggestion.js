import { clickable } from 'ember-cli-page-object';

export default {
  clickOnTeamsLink: clickable('a'),
  clickOnDismissButton: clickable('[data-test-dismiss-button]'),
  scope: '[data-test-private-leaderboard-feature-suggestion]',
};
