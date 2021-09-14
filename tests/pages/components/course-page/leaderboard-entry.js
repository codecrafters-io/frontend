import { hasClass, text } from 'ember-cli-page-object';
import LeaderboardEntry from 'codecrafters-frontend/tests/pages/components/course-page/leaderboard-entry';

export default {
  statusIsActive: hasClass('border-yellow-500', '[data-test-progress-bar-container]'),
  statusIsIdle: hasClass('border-teal-500', '[data-test-progress-bar-container]'),
  username: text('[data-test-username]', LeaderboardEntry),
  scope: '[data-test-leaderboard-entry]',
};
