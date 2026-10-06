import { clickable, isVisible, text } from 'ember-cli-page-object';

export default {
  clickOnEndInterviewButton: clickable('[data-test-end-interview-button]'),
  endInterviewButtonIsVisible: isVisible('[data-test-end-interview-button]'),
  remainingTimeText: text('[data-test-remaining-time]'),
  scope: '[data-test-top-bar]',
  titleText: text('[data-test-title]'),
};
