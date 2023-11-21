import { clickable, text } from 'ember-cli-page-object';

export default {
  clickOnNextStepButton: clickable('[data-test-next-step-button]'),
  stepName: text('[data-test-step-name]'),
  progressIndicatorText: text('[data-test-progress-indicator-text]'),
  scope: '[data-test-course-page-header]',
};
