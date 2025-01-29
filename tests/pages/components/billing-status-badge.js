import { clickable, hasClass, isVisible, text, triggerable } from 'ember-cli-page-object';

export default {
  discountTimerBadge: {
    scope: '[data-test-discount-timer-badge]',
    hover: triggerable('mouseenter'),
    click: clickable(),
    isVisible: isVisible(),
    text: text(),
    timeLeftText: text('[data-test-discount-timer-badge-time-left-text]', { normalized: true }),
    hasSmallSize: hasClass('px-1.5'),
    hasLargeSize: hasClass('px-2'),
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
