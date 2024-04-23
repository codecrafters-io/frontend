import { attribute, isPresent, text } from 'ember-cli-page-object';

export default {
  actionText: text('[data-test-action-text]'),
  name: text('[data-test-track-name]'),
  description: text('[data-test-track-description]'),
  hasPopularLabel: isPresent('[data-test-popular-track-label]'),
  hasProgressBar: isPresent('[data-test-track-progress]'),
  hasDifficultyLabel: isPresent('[data-test-track-difficulty-label]'),
  progressText: text('[data-test-track-progress-text]'),
  progressBarStyle: attribute('style', '[data-test-track-progress-bar]'),
};
