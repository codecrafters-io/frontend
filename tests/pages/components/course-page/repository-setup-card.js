import { clickable, clickOnText, isVisible, text } from 'ember-cli-page-object';
import requestLanguageDropdown from './repository-setup-card/request-language-dropdown';

export default {
  clickOnLanguageButton: clickOnText('button'),
  clickOnRequestLanguageButton: clickable('.ember-basic-dropdown-trigger'),
  continueButton: { scope: '[data-test-continue-button]' },
  copyableCloneRepositoryInstructions: text('[data-test-copyable-repository-clone-instructions] .font-mono'),
  description: text('[data-test-course-description]'),
  footerText: text('[data-test-footer]'),
  hasRequestedLanguagesPrompt: isVisible('[data-test-requested-languages-prompt]'),
  isOnCreateRepositoryStep: isVisible('[data-test-create-repository-step]'),
  isOnCloneRepositoryStep: isVisible('[data-test-clone-repository-step]'),

  requestedLanguagesPrompt: {
    scope: '[data-test-requested-languages-prompt]',
    willLetYouKnowText: text('[data-test-will-let-you-know-text]'),
  },

  requestLanguageDropdown: requestLanguageDropdown,
  scope: '[data-test-repository-setup-card]',

  get statusIsInProgress() {
    return this.statusText === 'In-progress';
  },

  get statusIsComplete() {
    return this.statusText === 'Completed';
  },

  statusText: text('[data-test-status-text]'),
};
