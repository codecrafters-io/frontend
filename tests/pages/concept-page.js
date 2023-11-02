import { collection, clickable, clickOnText, visitable } from 'ember-cli-page-object';
import { animationsSettled } from 'ember-animated/test-support';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  _clickOnContinueButton: clickable('[data-test-continue-button]'),

  async clickOnContinueButton() {
    this._clickOnContinueButton();
    await animationsSettled();
  },

  questionCards: collection('[data-test-question-card]', {
    selectOption: clickOnText('[data-test-question-card-option]'),
    clickOnSubmitButton: clickable('[data-test-question-card-submit-button]'),
    clickOnContinueButton: clickable('[data-test-question-card-continue-button]'),
    clickOnShowExplanationButton: clickable('[data-test-question-card-show-explanation-button]'),
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
