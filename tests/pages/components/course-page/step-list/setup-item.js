import { clickOnText, isVisible, text } from 'ember-cli-page-object';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';

export default {
  instructions: '',

  async clickOnLanguageButton(language) {
    this.clickOnLanguageButtonRaw(language);
    await finishRender();
  },

  clickOnLanguageButtonRaw: clickOnText('button'), // causes timer to start, override waiting function
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
