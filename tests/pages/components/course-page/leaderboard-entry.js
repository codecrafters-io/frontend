import { hasClass, text } from 'ember-cli-page-object';

export default {
  progressText: text('[data-test-progress-text]'),
  statusIsActive: hasClass('border-yellow-500', '[data-test-progress-bar-container]'),
  statusIsIdle: hasClass('border-teal-500', '[data-test-progress-bar-container]'),
  username: text('[data-test-username]'),
  scope: '[data-test-leaderboard-entry]',
};
