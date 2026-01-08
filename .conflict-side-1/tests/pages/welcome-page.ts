import createPage from 'codecrafters-frontend/tests/support/create-page';
import { clickOnText, clickable, collection, fillable, visitable } from 'ember-cli-page-object';

export default createPage({
  onboardingSurveyWizard: {
    clickOnContinueButton: clickable('[data-test-continue-button]'),
    clickOnSelectableItem: clickOnText('[data-test-selectable-item]'),
    fillInFreeFormInput: fillable('[data-test-free-form-input]'),
    selectableItems: collection('[data-test-selectable-item]'),
    scope: '[data-test-onboarding-survey-wizard]',
  },

  visit: visitable('/welcome'),
});
