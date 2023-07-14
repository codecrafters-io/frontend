import { text } from 'ember-cli-page-object';

export default {
  stepName: text('[data-test-step-name]'),
  progressIndicatorText: text('[data-test-progress-indicator-text]'),
  scope: '[data-test-desktop-header]',
};
