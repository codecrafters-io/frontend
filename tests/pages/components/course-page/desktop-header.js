import { clickable, text, triggerable } from 'ember-cli-page-object';

export default {
  clickOnCloseCourseButton: clickable('[data-test-close-course-button]'),
  clickOnNextStepButton: clickable('[data-test-next-step-button]'),

  freeWeeksLeftButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-free-weeks-left-button]',
  },

  progressIndicatorText: text('[data-test-progress-indicator-text]'),
  scope: '[data-test-course-page-header]',
  stepName: text('[data-test-step-name]'),

  upgradeButton: {
    scope: '[data-test-upgrade-button]',
  },

  vipBadge: {
    scope: '[data-test-vip-badge]',
  },
};
