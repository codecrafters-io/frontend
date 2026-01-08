import { collection, clickOnText, clickable, isVisible, text } from 'ember-cli-page-object';
import requestLanguageDropdown from './repository-setup-card/request-language-dropdown';

export default {
  clickOnContinueButton: clickable('[data-test-continue-button]'),
  clickOnLanguageButton: clickOnText('button'),
  clickOnNextQuestionButton: clickable('[data-test-next-question-button]'),
  clickOnOptionButton: clickOnText('button'),
  clickOnRequestLanguageButton: clickable('.ember-basic-dropdown-trigger'),
  continueButton: { scope: '[data-test-continue-button]' },
  copyableCloneRepositoryInstructions: text('[data-test-copyable-repository-clone-instructions] .font-mono'),
  description: text('[data-test-course-description]'),
  expandedSectionTitle: text('[data-test-expanded-section-title]'),
  footerText: text('[data-test-footer]'),
  hasRequestedLanguagesPrompt: isVisible('[data-test-requested-languages-prompt]'),
  languageButtons: collection('[data-test-language-button]', {
    text: text('[data-test-language-button-text]'),
  }),

  requestedLanguagesPrompt: {
    scope: '[data-test-requested-languages-prompt]',
    willLetYouKnowText: text('[data-test-will-let-you-know-text]'),
  },

  requestLanguageDropdown: requestLanguageDropdown,
  scope: '[data-test-create-repository-card]',
  showOtherLanguagesButton: { scope: '[data-test-show-other-languages-button]' },

  get statusIsInProgress() {
    return this.statusText === 'In-progress';
  },

  get statusIsComplete() {
    return this.statusText === 'Completed';
  },

  statusText: text('[data-test-status-text]'),
};
