import { clickable, clickOnText, hasClass, isPresent, text } from 'ember-cli-page-object';

export default {
  footerText: text('[data-test-course-stage-item-footer] [data-test-footer-text]'),
  hasUpgradePrompt: isPresent('[data-test-upgrade-prompt]'),

  moreDropdown: {
    clickOnLink: clickOnText('div[role="button"]'),
    toggle: clickable('[data-test-course-stage-item-more-dropdown-trigger]', { resetScope: true }),
    resetScope: true,
    scope: '[data-test-course-stage-item-more-dropdown-content]',
  },

  scope: '[data-test-course-stage-item]',

  get statusIsInProgress() {
    return this.statusText === 'IN PROGRESS';
  },

  get statusIsComplete() {
    return this.statusText === 'COMPLETE';
  },

  stageInstructionsText: text('[data-test-stage-instructions]'),
  statusText: text('[data-test-status-text]'),
  title: text('[data-test-course-stage-name]'),

  upgradePrompt: {
    clickOnSubscribeButton: clickable('[data-test-subscribe-button]'),
    colorIsGray: hasClass('text-gray-500', '.text-sm'),
    colorIsYellow: hasClass('text-yellow-700', '.text-sm'),
    scope: '[data-test-upgrade-prompt]',
  },
};
