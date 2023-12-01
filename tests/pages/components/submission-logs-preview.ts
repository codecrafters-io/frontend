import { collection } from 'ember-cli-page-object';

export default {
  get logs() {
    return this.logLines.map((line) => line.text).join('\n');
  },

  logLines: collection('[data-test-log-line]'),
  scope: '[data-test-submission-logs-preview]',
};
