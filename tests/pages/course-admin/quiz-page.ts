import createPage from 'codecrafters-frontend/tests/support/create-page';
import { attribute, clickable, collection, fillable, isVisible, text, visitable } from 'ember-cli-page-object';

export default createPage({
  clickOnEligibleButton: clickable('[data-test-eligible-button]'),
  clickOnLoadRecordingButton: clickable('[data-test-load-recording-button]'),
  clickOnNotEligibleButton: clickable('[data-test-not-eligible-button]'),

  closingAnswers: collection('[data-test-closing-answer]', {
    quoteText: text('[data-test-closing-answer-quote]'),
    summaryText: text('[data-test-closing-answer-summary]'),
  }),

  decisionText: text('[data-test-review-decision]'),
  fillInReviewNote: fillable('[data-test-review-note]'),

  questions: collection('[data-test-quiz-question]', {
    quoteText: text('[data-test-question-quote]'),
    stageText: text('[data-test-question-stage]'),
    submissionsLinkHref: attribute('href', '[data-test-stage-submissions-link]'),
    verdictText: text('[data-test-question-verdict]'),
  }),

  recordingPlayerIsVisible: isVisible('[data-test-recording-player]'),
  scoringFailedNoticeIsVisible: isVisible('[data-test-scoring-failed-notice]'),
  summaryText: text('[data-test-quiz-summary]'),
  transcriptTurns: collection('[data-test-transcript-turn]'),
  visit: visitable('/courses/:course_slug/admin/quizzes/:quiz_id'),
});
