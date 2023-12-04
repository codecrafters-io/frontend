import { clickable, text, triggerable } from 'ember-cli-page-object';

export default {
  clickOnNextStepButton: clickable('[data-test-next-step-button]'),

  freeWeeksLeftButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-free-weeks-left-button]',
  },

  progressIndicatorText: text('[data-test-progress-indicator-text]'),
  stepName: text('[data-test-step-name]'),

  subscribeButton: {
    scope: '[data-test-subscribe-button]',
  },

  scope: '[data-test-course-page-header]',

  vipBadge: {
    scope: '[data-test-vip-badge]',
  },
};
