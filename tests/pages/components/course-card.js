import { isPresent, text } from 'ember-cli-page-object';

export default {
  actionText: text('[data-test-action-text]'),
  description: text('[data-test-course-description]'),
  hasAlphaLabel: isPresent('[data-test-course-alpha-label]'),
  hasBetaLabel: isPresent('[data-test-course-beta-label]'),
  hasDifficultyLabel: isPresent('[data-test-course-difficulty-label]'),
  hasFreeLabel: isPresent('[data-test-course-free-label]'),
  hasLockIcon: isPresent('[data-test-lock-icon]'),
  hasProgressDonut: isPresent('[data-test-course-progress-donut]'),
  name: text('[data-test-course-name]'),
  progressText: text('[data-test-course-progress-text]'),
};
