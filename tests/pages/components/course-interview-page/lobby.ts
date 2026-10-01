import { clickable, collection, isVisible } from 'ember-cli-page-object';

export default {
  clickOnCaptionsCheckbox: clickable('[data-test-captions-checkbox]'),
  clickOnStartInterviewButton: clickable('[data-test-start-interview-button]'),
  microphoneBlockedNoticeIsVisible: isVisible('[data-test-microphone-blocked-notice]'),
  scope: '[data-test-lobby]',
  stagesCovered: collection('[data-test-stage-covered]'),
};
