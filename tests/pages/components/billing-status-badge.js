import { clickable, hasClass, isVisible, text, triggerable } from 'ember-cli-page-object';

export default {
  discountTimerBadge: {
    scope: '[data-test-discount-timer-badge]',
    hover: triggerable('mouseenter'),
    timeLeftText: text('[data-test-discount-timer-badge-time-left-text]', { normalized: true }),
    isSmallSize: hasClass('px-1.5'),
    isLargeSize: hasClass('px-2'),
  },

  freeWeeksLeftButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-free-weeks-left-button]',
  },

  memberBadge: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-member-badge]',
  },

  upgradeButton: {
    scope: '[data-test-upgrade-button]',
  },

  vipBadge: {
    scope: '[data-test-vip-badge]',
  },
};
