import { text } from 'ember-cli-page-object';

export default {
  instructionsText: text('[data-test-instructions-text]'),
  scope: '[data-test-course-completed-item]',
};
