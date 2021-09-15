import { collection } from 'ember-cli-page-object';
import LeaderboardEntry from 'codecrafters-frontend/tests/pages/components/course-page/leaderboard-entry';

export default {
  entries: collection('[data-test-leaderboard-entry]', LeaderboardEntry),
  scope: '[data-test-leaderboard]',
};
