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

  pressBackspace: triggerable('keydown', '.continue-or-step-back-button', { eventProperties: { key: 'Backspace' } }),
  pressEnter: triggerable('keydown', '.continue-or-step-back-button', { eventProperties: { key: 'Enter' } }),
  pressSpace: triggerable('keydown', '.continue-or-step-back-button', { eventProperties: { key: ' ' } }),

  questionCards: collection('[data-test-question-card]', {
    selectOption: clickOnText('[data-test-question-card-option]'),
    clickOnSubmitButton: clickable('[data-test-question-card-submit-button]'),
    clickOnContinueButton: clickable('[data-test-question-card-continue-button]'),
    clickOnShowExplanationButton: clickable('[data-test-question-card-show-explanation-button]'),
  }),

  visit: visitable('/concept/:slug'),
});
