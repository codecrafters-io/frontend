import { isPresent, text } from 'ember-cli-page-object';

export default {
  actionText: text('[data-test-action-text]'),
  name: text('[data-test-course-name]'),
  description: text('[data-test-course-description]'),
  hasAlphaLabel: isPresent('[data-test-course-alpha-label]'),
  hasBetaLabel: isPresent('[data-test-course-beta-label]'),
};
