import { collection, clickable, clickOnText } from 'ember-cli-page-object';

export default {
  clickOnConfigureExtensionsButton: clickable('[data-test-configure-extensions-button]'),
  clickOnStepListItem: clickOnText('[data-test-step-list-item]'),
  scope: '[data-test-course-page-sidebar]',
  stepListItems: collection('[data-test-step-list-item]'),
};
