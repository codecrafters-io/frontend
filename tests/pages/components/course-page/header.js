import { clickable, text } from 'ember-cli-page-object';
import BillingStatusBadge from 'codecrafters-frontend/tests/pages/components/billing-status-badge';
import DarkModeToggle from 'codecrafters-frontend/tests/pages/components/dark-mode-toggle';

export default {
  clickOnCloseCourseButton: clickable('[data-test-close-course-button]'),
  clickOnNextStepButton: clickable('[data-test-next-step-button]'),
  darkModeToggle: DarkModeToggle,

  discountTimerBadge: BillingStatusBadge.discountTimerBadge,

  freeWeeksLeftButton: BillingStatusBadge.freeWeeksLeftButton,

  memberBadge: BillingStatusBadge.memberBadge,

  progressIndicatorText: text('[data-test-progress-indicator-text]'),
  scope: '[data-test-course-page-header]',
  stepName: text('[data-test-step-name]'),

  upgradeButton: BillingStatusBadge.upgradeButton,

  vipBadge: BillingStatusBadge.vipBadge,
};
