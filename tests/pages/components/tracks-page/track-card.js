import { attribute, isPresent, text } from 'ember-cli-page-object';

export default {
  actionText: text('[data-test-action-text]'),
  name: text('[data-test-track-name]'),
  description: text('[data-test-track-description]'),
  hasAlphaLabel: isPresent('[data-test-track-alpha-label]'),
  hasBetaLabel: isPresent('[data-test-track-beta-label]'),
  hasProgressBar: isPresent('[data-test-track-progress]'),
  hasDifficultyLabel: isPresent('[data-test-track-difficulty-label]'),
  progressText: text('[data-test-track-progress-text]'),
  progressBarStyle: attribute('style', '[data-test-track-progress-bar]'),
};
