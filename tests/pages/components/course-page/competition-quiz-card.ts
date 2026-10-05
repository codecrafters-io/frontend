import InterviewRecordingNotice from 'codecrafters-frontend/tests/pages/components/interview-recording-notice';
import { clickable, isVisible, text } from 'ember-cli-page-object';

export default {
  clickOnTakeQuizButton: clickable('[data-test-take-quiz-button]'),
  recordingNotice: InterviewRecordingNotice,
  scope: '[data-test-competition-quiz-card]',
  submittedNoticeIsVisible: isVisible('[data-test-quiz-submitted-notice]'),
  takeQuizButton: { scope: '[data-test-take-quiz-button]' },
  titleText: text('[data-test-competition-quiz-card-title]'),
};
