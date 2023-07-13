import { clickable, text } from 'ember-cli-page-object';

// Legacy, to be removed
export default {
  earnedBadgeNotice: {
    badgeEarnedModal: {
      badgeName: text('[data-test-badge-name]'),
      scope: '[data-test-badge-earned-modal]',
    },

    clickOnViewButton: clickable('[data-test-view-button]'),
    scope: '[data-test-earned-badge-notice]',
  },
};
