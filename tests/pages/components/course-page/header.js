import { clickable, text, triggerable } from 'ember-cli-page-object';
import DarkModeToggle from 'codecrafters-frontend/tests/pages/components/dark-mode-toggle';

export default {
  clickOnCloseCourseButton: clickable('[data-test-close-course-button]'),
  clickOnNextStepButton: clickable('[data-test-next-step-button]'),
  darkModeToggle: DarkModeToggle,

  freeWeeksLeftButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-free-weeks-left-button]',
  },

  memberBadge: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-member-badge]',
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
