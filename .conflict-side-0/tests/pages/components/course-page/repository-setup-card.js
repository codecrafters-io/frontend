import { text } from 'ember-cli-page-object';

export default {
  continueButton: { scope: '[data-test-continue-button]' },
  description: text('[data-test-course-description]'),
  footerText: text('[data-test-footer]'),

  cloneRepositoryStep: {
    copyableTerminalCommand: text('[data-test-copyable-terminal-command] pre code'),
    troubleshootLink: { scope: '[data-test-troubleshoot-link]' },
    scope: '[data-test-clone-repository-step]',
  },

  testCliConnectionStep: {
    troubleshootLink: { scope: '[data-test-troubleshoot-link]' },
    scope: '[data-test-test-cli-connection-step]',
  },

  scope: '[data-test-repository-setup-card]',

  get statusIsInProgress() {
    return this.statusText === 'In-progress';
  },

  get statusIsComplete() {
    return this.statusText === 'Completed';
  },

  statusText: text('[data-test-status-text]'),
};
