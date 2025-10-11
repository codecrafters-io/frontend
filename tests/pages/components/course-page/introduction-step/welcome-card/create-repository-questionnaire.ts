import { collection, clickOnText, clickable, hasClass, isVisible, text } from 'ember-cli-page-object';
import RequestLanguageDropdown from './create-repository-questionnaire/request-language-dropdown';

export default {
  get expandedStepTitle() {
    return this.steps.toArray().find((step) => step.isExpanded)?.title;
  },

  continueButton: { scope: '[data-test-continue-button]' },
  clickOnNextStepButton: clickable('[data-test-next-step-button]'),

  selectLanguageStep: {
    clickOnLanguageButton: clickOnText('[data-test-language-button]'),
    clickOnRequestLanguageButton: clickable('.ember-basic-dropdown-trigger'),
    hasRequestedLanguagesPrompt: isVisible('[data-test-requested-languages-prompt]'),

    languageButtons: collection('[data-test-language-button]', {
      text: text('[data-test-language-button-text]'),
    }),

    requestLanguageDropdown: RequestLanguageDropdown,

    requestedLanguagesPrompt: {
      scope: '[data-test-requested-languages-prompt]',
      willLetYouKnowText: text('[data-test-will-let-you-know-text]'),
    },

    showOtherLanguagesButton: { scope: '[data-test-show-other-languages-button]' },
    scope: '[data-test-select-language-step]',
  },

  selectLanguageProficiencyLevelStep: {
    clickOnOptionButton: clickOnText('[data-test-option-button]'),

    continueButton: {
      isDisabled: hasClass('opacity-50'),
      scope: '[data-test-continue-button]',
    },

    scope: '[data-test-select-language-proficiency-level-step]',
  },

  selectExpectedActivityFrequencyStep: {
    clickOnOptionButton: clickOnText('[data-test-option-button]'),
    scope: '[data-test-select-expected-activity-frequency-step]',
  },

  selectRemindersPreferenceStep: {
    clickOnOptionButton: clickOnText('[data-test-option-button]'),
    scope: '[data-test-select-reminders-preference-step]',
  },

  steps: collection('[data-test-expandable-step-list-step]', {
    title: text('[data-test-step-title]'),
    isExpanded: isVisible('[data-test-expanded-step-content]'),
  }),

  scope: '[data-test-create-repository-questionnaire]',
};
