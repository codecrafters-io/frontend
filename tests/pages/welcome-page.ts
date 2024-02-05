import createPage from 'codecrafters-frontend/tests/support/create-page';
import { clickOnText, clickable, collection, visitable } from 'ember-cli-page-object';

export default createPage({
  onboardingSurveyWizard: {
    clickOnContinueButton: clickable('[data-test-continue-button]'),
    clickOnSelectableItem: clickOnText('[data-test-selectable-item]'),
    selectableItems: collection('[data-test-selectable-item]'),
    scope: '[data-test-onboarding-survey-wizard]',
  },

  visit: visitable('/welcome'),
});
