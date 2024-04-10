import { collection, clickOnText, triggerable } from 'ember-cli-page-object';

export default {
  configureExtensionsButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-configure-extensions-button]',
  },

  configureExtensionsToggles: collection('[data-test-configure-extensions-toggle]', {
    hover: triggerable('mouseenter'),
  }),

  clickOnStepListItem: clickOnText('[data-test-step-list-item]'),
  scope: '[data-test-course-page-sidebar]',
  stepListItems: collection('[data-test-step-list-item]'),
};
