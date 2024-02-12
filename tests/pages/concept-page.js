import { attribute, collection, clickable, clickOnText, isPresent, text, visitable } from 'ember-cli-page-object';
import { animationsSettled } from 'ember-animated/test-support';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  blocks: collection('[data-test-block]'),
  _clickOnContinueButton: clickable('[data-test-continue-button]'),

  async clickOnContinueButton() {
    this._clickOnContinueButton();
    await animationsSettled();
  },

  hasProgressBar: isPresent('[data-test-concept-progress]'),
  progressText: text('[data-test-concept-progress-text]'),
  progressBarStyle: attribute('style', '[data-test-concept-progress-bar]'),

  questionCards: collection('[data-test-question-card]', {
    selectOption: clickOnText('[data-test-question-card-option]'),
    clickOnSubmitButton: clickable('[data-test-question-card-submit-button]'),
    clickOnContinueButton: clickable('[data-test-question-card-continue-button]'),
    clickOnShowExplanationButton: clickable('[data-test-question-card-show-explanation-button]'),
    hasSubmitted: isPresent('[data-test-question-submitted]'),
  }),

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
