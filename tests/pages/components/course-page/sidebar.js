import { clickOnText } from 'ember-cli-page-object';

export default {
  clickOnStepListItem: clickOnText('[data-test-step-list-item]'),
  scope: '[data-test-course-page-sidebar]',
};
