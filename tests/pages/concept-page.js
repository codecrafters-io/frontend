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
  pressBackspace: triggerable('keydown', '.continue-or-step-back-button', { eventProperties: { key: 'Backspace' } }),
  pressC: triggerable('keydown', '.question-card', { eventProperties: { key: 'C' } }),
  pressD: triggerable('keydown', '.question-card', { eventProperties: { key: 'D' } }),
  pressEnterToContinue: triggerable('keydown', '.continue-or-step-back-button', { eventProperties: { key: 'Enter' } }),
  pressEnterToSubmit: triggerable('keydown', '.question-card', { eventProperties: { key: 'Enter' } }),
  pressSpace: triggerable('keydown', '.continue-or-step-back-button', { eventProperties: { key: ' ' } }),

  questionCards: collection('[data-test-question-card]', {
    selectOption: clickOnText('[data-test-question-card-option]'),
    clickOnSubmitButton: clickable('[data-test-question-card-submit-button]'),
    clickOnContinueButton: clickable('[data-test-question-card-continue-button]'),
    clickOnShowExplanationButton: clickable('[data-test-question-card-show-explanation-button]'),
  }),

  visit: visitable('/concept/:slug'),
});
