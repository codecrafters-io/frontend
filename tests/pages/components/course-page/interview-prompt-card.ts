import InterviewRecordingNotice from 'codecrafters-frontend/tests/pages/components/interview-recording-notice';
import { attribute, clickable, text } from 'ember-cli-page-object';

export default {
  clickOnStartInterviewButton: clickable('[data-test-start-interview-button]'),
  clickOnViewReportButton: clickable('[data-test-view-report-button]'),
  latestResultText: text('[data-test-latest-result]'),
  recordingNotice: InterviewRecordingNotice,
  scope: '[data-test-interview-prompt-card]',
  startInterviewButtonHref: attribute('href', '[data-test-start-interview-button]'),
  startInterviewButtonText: text('[data-test-start-interview-button]'),
  viewReportButton: { scope: '[data-test-view-report-button]' },
};
