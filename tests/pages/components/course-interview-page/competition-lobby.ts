import { clickable, collection, isVisible, property, text } from 'ember-cli-page-object';

export default {
  clickOnStartQuizButton: clickable('[data-test-start-quiz-button]'),
  noStagesNoticeIsVisible: isVisible('[data-test-no-stages-notice]'),
  oneAttemptNoticeText: text('[data-test-one-attempt-notice]'),
  scope: '[data-test-competition-lobby]',
  stagesCompleted: collection('[data-test-stage-completed]'),
  startQuizButtonIsDisabled: property('disabled', '[data-test-start-quiz-button]'),
};
