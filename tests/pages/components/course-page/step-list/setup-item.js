import { clickOnText, isVisible, text } from 'ember-cli-page-object';

export default {
  instructions: '',
  clickOnLanguageButton: clickOnText('button'),
  description: text('[data-test-course-description]'),
  isOnCreateRepositoryStep: isVisible('[data-test-create-repository-step]'),
  isOnCloneRepositoryStep: isVisible('[data-test-clone-repository-step]'),
  scope: '[data-test-setup-item]',
  statusText: text('[data-test-status-text]'),
};
