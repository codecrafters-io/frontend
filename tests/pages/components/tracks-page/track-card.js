import { isPresent, text } from 'ember-cli-page-object';

export default {
  actionText: text('[data-test-action-text]'),
  description: text('[data-test-track-description]'),
  hasDifficultyLabel: isPresent('[data-test-track-difficulty-label]'),
  hasPopularLabel: isPresent('[data-test-popular-track-label]'),
  hasProgressDonut: isPresent('[data-test-track-progress-donut]'),
  name: text('[data-test-track-name]'),
  progressText: text('[data-test-track-progress-text]'),
};
