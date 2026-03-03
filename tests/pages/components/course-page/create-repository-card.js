import { collection, clickOnText, clickable, isVisible, text } from 'ember-cli-page-object';
import { click } from '@ember/test-helpers';
import requestLanguageDropdown from './repository-setup-card/request-language-dropdown';

export default {
  async clickOnContinueButton() {
    const visibleContinueButtons = Array.from(document.querySelectorAll('[data-test-create-repository-card] [data-test-continue-button]')).filter(
      (element) => element instanceof HTMLElement && element.getClientRects().length > 0,
    );

    const continueButton = visibleContinueButtons[visibleContinueButtons.length - 1];

    if (!(continueButton instanceof HTMLElement)) {
      throw new Error('Could not find visible continue button');
    }

    await click(continueButton);
  },
  clickOnLanguageButton: clickOnText('button'),
  clickOnNextQuestionButton: clickable('[data-test-next-question-button]'),
  clickOnOptionButton: clickOnText('button'),
  clickOnRequestLanguageButton: clickable('.ember-basic-dropdown-trigger'),
  continueButton: { scope: '[data-test-continue-button]' },
  expandedSectionTitle: text('[data-test-expanded-section-title]'),
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
};
