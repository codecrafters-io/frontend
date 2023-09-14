import { clickable, clickOnText } from 'ember-cli-page-object';

export default {
  clickOnStepListItem: clickOnText('[data-test-step-list-item]'),
  clickOnConfigureExtensionsButton: clickable('[data-test-configure-extensions-button]'),
  scope: '[data-test-course-page-sidebar]',
};
