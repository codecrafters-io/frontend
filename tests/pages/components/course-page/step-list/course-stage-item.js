import { clickable, clickOnText, hasClass, isPresent, text } from 'ember-cli-page-object';

export default {
  clickOnActionButton: clickOnText('[data-test-action-button]'),
  footerText: text('[data-test-course-stage-item-footer] [data-test-footer-text]'),
  hasUpgradePrompt: isPresent('[data-test-upgrade-prompt]'),
  hasPostCompletionPrompt: isPresent('[data-test-post-completion-prompt]'),
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

  postCompletionPrompt: {
    clickOnViewSolutionLink: clickable('[data-test-view-solution-link]'),
    clickOnViewNextStageLink: clickable('[data-test-view-next-stage-link]'),
    scope: '[data-test-post-completion-prompt]',
  },
};
