import { attribute, clickOnText, clickable, collection, isPresent, text, triggerable, visitable, hasClass } from 'ember-cli-page-object';
import { animationsSettled } from 'ember-animated/test-support';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  blocks: collection('[data-test-block]'),
  _clickOnContinueButton: clickable('[data-test-continue-button]'),
  _clickOnStepBackButton: clickable('[data-test-step-back-button]'),

  async clickOnContinueButton() {
    await this._clickOnContinueButton();
    await animationsSettled();
  },

  async clickOnStepBackButton() {
    await this._clickOnStepBackButton();
    await animationsSettled();
  },

  conceptCompletedModal: {
    clickOnSignInButton: clickable('[data-test-concept-completed-modal-sign-in-button]'),
    isVisible: isPresent(),
    scope: '[data-test-concept-completed-modal]',
    text: text(),
  },

  progress: {
    barStyle: attribute('style', '[data-test-concept-progress-bar]'),
    scope: '[data-test-concept-progress]',
  },

  questionCards: collection('[data-test-question-card]', {
    body: {
      scope: '[data-test-question-card-body]',
      hasPrismHighlighting: hasClass('has-prism-highlighting'),
    },

    clickOnSubmitButton: clickable('[data-test-question-card-submit-button]'),
    clickOnContinueButton: clickable('[data-test-question-card-continue-button]'),
    clickOnShowExplanationButton: clickable('[data-test-question-card-show-explanation-button]'),

    focusedOption: {
      scope: '[data-test-question-card-option]:focus',
    },

    hasSubmitted: isPresent('[data-test-question-submitted]'),
    hasSubmittedText: text('[data-test-question-submitted]'),
    keydown: triggerable('keydown', '.question-card-option-container'),
    selectOption: clickOnText('[data-test-question-card-option]'),
  }),

  focusedContinueButton: {
    scope: '[data-test-continue-button]:focus',
  },

  shareConceptContainer: {
    clickOnCopyButton: clickable('[data-test-copy-button]'),
    scope: '[data-test-share-concept-container]',
  },

  upcomingConcept: {
    card: {
      title: {
        scope: '[data-test-concept-title]',
      },

      scope: '[data-test-concept-card]',
    },

    title: {
      scope: '[data-test-upcoming-concept-title]',
    },

    scope: '[data-test-upcoming-concept]',
  },

  visit: visitable('/concept/:slug'),
});
