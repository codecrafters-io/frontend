import InterviewRecordingNotice from 'codecrafters-frontend/tests/pages/components/interview-recording-notice';
import { clickable, collection, isVisible, property, text } from 'ember-cli-page-object';

export default {
  clickOnStartQuizButton: clickable('[data-test-start-button]'),
  noStagesNoticeIsVisible: isVisible('[data-test-no-stages-notice]'),
  oneAttemptNoticeText: text('[data-test-one-attempt-notice]'),
  recordingNotice: InterviewRecordingNotice,
  scope: '[data-test-competition-lobby]',

  stageGroups: collection('[data-test-stage-group]', {
    clickOnSummary: clickable('[data-test-stage-group-summary]'),
    countText: text('[data-test-stage-group-count]'),
    isExpanded: property('open'),
    name: text('[data-test-stage-group-name]'),
    stages: collection('[data-test-stage-completed]'),
  }),

  startQuizButtonIsDisabled: property('disabled', '[data-test-start-button]'),
  totalStagesText: text('[data-test-stages-completed-total]'),
};
