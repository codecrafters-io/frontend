import InterviewRecordingNotice from 'codecrafters-frontend/tests/pages/components/interview-recording-notice';
import { clickable, collection, isVisible } from 'ember-cli-page-object';

export default {
  clickOnCaptionsCheckbox: clickable('[data-test-captions-checkbox]'),
  clickOnStartInterviewButton: clickable('[data-test-start-button]'),
  microphoneBlockedNoticeIsVisible: isVisible('[data-test-microphone-blocked-notice]'),
  recordingNotice: InterviewRecordingNotice,
  scope: '[data-test-lobby]',
  stagesCovered: collection('[data-test-stage-covered]'),
};
