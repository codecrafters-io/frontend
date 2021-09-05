import { text } from 'ember-cli-page-object';

export default {
  footerText: text('[data-test-course-stage-item-footer] [data-test-footer-text]'),
  scope: '[data-test-course-stage-item]',

  get statusIsInProgress() {
    return this.statusText === 'IN PROGRESS';
  },

  get statusIsComplete() {
    return this.statusText === 'COMPLETE';
  },

  statusText: text('[data-test-status-text]'),
};
