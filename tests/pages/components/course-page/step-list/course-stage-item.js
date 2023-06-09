import { attribute, clickable, clickOnText, isPresent, text } from 'ember-cli-page-object';

export default {
  clickOnActionButton: clickOnText('[data-test-action-button]'),

  earnedBadgeNotice: {
    badgeEarnedModal: {
      badgeName: text('[data-test-badge-name]'),
      scope: '[data-test-badge-earned-modal]',
    },

    clickOnViewButton: clickable('[data-test-view-button]'),
    scope: '[data-test-earned-badge-notice]',
  },

  feedbackPrompt: {
    clickOnOption: clickOnText('[data-test-feedback-prompt-option]'),
    clickOnSubmitButton: clickable('button'),
    explanationTextareaPlaceholder: attribute('placeholder', 'textarea'),
    questionText: text('[data-test-question-text]'),
    scope: '[data-test-feedback-prompt]',
  },

  footerText: text('[data-test-course-stage-item-footer] [data-test-footer-text]'),
  hasFeedbackPrompt: isPresent('[data-test-feedback-prompt]'),
  hasUpgradePrompt: isPresent('[data-test-upgrade-prompt]'),
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
    scope: '[data-test-upgrade-prompt]',
  },
};
