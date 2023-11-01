import { collection, clickable, clickOnText, triggerable, visitable } from 'ember-cli-page-object';
import { animationsSettled } from 'ember-animated/test-support';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  _clickOnContinueButton: clickable('[data-test-continue-button]'),

  blocks: collection('[data-test-concept-block]'),

  async clickOnContinueButton() {
    this._clickOnContinueButton();
    await animationsSettled();
  },

  pressA: triggerable('keydown', '.question-card', { eventProperties: { key: 'A' } }),
  pressB: triggerable('keydown', '.question-card', { eventProperties: { key: 'B' } }),
  pressC: triggerable('keydown', '.question-card', { eventProperties: { key: 'C' } }),
  pressD: triggerable('keydown', '.question-card', { eventProperties: { key: 'D' } }),
  pressE: triggerable('keydown', '.question-card', { eventProperties: { key: 'E' } }),

  questionCards: collection('[data-test-question-card]', {
    clickOnContinueButton: clickable('[data-test-question-card-continue-button]'),
    clickOnShowExplanationButton: clickable('[data-test-question-card-show-explanation-button]'),
    clickOnSubmitButton: clickable('[data-test-question-card-submit-button]'),
    selectOption: clickOnText('[data-test-question-card-option]'),
  }),

  visit: visitable('/concept/:slug'),
});
