import { attribute, isPresent, text } from 'ember-cli-page-object';

export default {
  actionText: text('[data-test-action-text]'),
  name: text('[data-test-course-name]'),
  description: text('[data-test-course-description]'),
  hasAlphaLabel: isPresent('[data-test-course-alpha-label]'),
  hasBetaLabel: isPresent('[data-test-course-beta-label]'),
  hasProgressBar: isPresent('[data-test-course-progress]'),
  hasDifficultyLabel: isPresent('[data-test-course-difficulty-label]'),
  progressText: text('[data-test-course-progress-text]'),
  progressBarStyle: attribute('style', '[data-test-course-progress-bar]'),
};
