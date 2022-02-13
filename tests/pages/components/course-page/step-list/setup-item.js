import { clickOnText, isVisible, text } from 'ember-cli-page-object';

export default {
  instructions: '',
  clickOnLanguageButton: clickOnText('button'),
  copyableCloneRepositoryInstructions: text('[data-test-copyable-repository-clone-instructions] .font-mono'),
  description: text('[data-test-course-description]'),
  footerText: text('[data-test-setup-item-footer] [data-test-footer-text]'),
  isOnCreateRepositoryStep: isVisible('[data-test-create-repository-step]'),
  isOnCloneRepositoryStep: isVisible('[data-test-clone-repository-step]'),
  scope: '[data-test-setup-item]',

  get statusIsInProgress() {
    return this.statusText === 'IN PROGRESS';
  },

  get statusIsComplete() {
    return this.statusText === 'COMPLETE';
  },

  statusText: text('[data-test-status-text]'),
};
