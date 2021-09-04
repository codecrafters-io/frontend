import { text } from 'ember-cli-page-object';

export default {
  instructions: '',
  description: text('[data-test-course-description]'),
  scope: '[data-test-setup-item]',
  statusText: text('[data-test-status-text]'),
};
