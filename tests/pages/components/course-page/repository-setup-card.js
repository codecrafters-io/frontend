import { attribute, text } from 'ember-cli-page-object';

export default {
  continueButton: { scope: '[data-test-continue-button]' },
  copyableCloneRepositoryInstructions: text('[data-test-copyable-repository-clone-instructions] .font-mono'),
  description: text('[data-test-course-description]'),
  footerText: text('[data-test-footer]'),
  gitCloneIssuesLink: {
    text: text('[data-test-git-clone-issues-link]'),
    href: attribute('href', '[data-test-git-clone-issues-link]'),
  },
  runGitCommandsLink: {
    text: text('[data-test-run-git-commands-link]'),
    href: attribute('href', '[data-test-run-git-commands-link]'),
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
