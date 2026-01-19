import { collection, text } from 'ember-cli-page-object';

export default {
  titleText: text('[data-test-leaderboard-title]'),

  rows: collection('[data-test-leaderboard-row]', {
    rank: text('[data-test-rank]'),
    score: text('[data-test-score]'),
    username: text('[data-test-username]'),
  }),

  scope: '[data-test-track-leaderboard]',
};
