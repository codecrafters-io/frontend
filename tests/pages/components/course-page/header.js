import { clickable, text } from 'ember-cli-page-object';
import DarkModeToggle from 'codecrafters-frontend/tests/pages/components/dark-mode-toggle';
import billingStatusBadge from '../billing-status-badge';

export default {
  clickOnCloseCourseButton: clickable('[data-test-close-course-button]'),
  clickOnNextStepButton: clickable('[data-test-next-step-button]'),
  darkModeToggle: DarkModeToggle,

  discountTimerBadge: billingStatusBadge.discountTimerBadge,

  freeWeeksLeftButton: billingStatusBadge.freeWeeksLeftButton,

  memberBadge: billingStatusBadge.memberBadge,

  progressIndicatorText: text('[data-test-progress-indicator-text]'),
  scope: '[data-test-course-page-header]',
  stepName: text('[data-test-step-name]'),

  upgradeButton: billingStatusBadge.upgradeButton,

  vipBadge: billingStatusBadge.vipBadge,
};
