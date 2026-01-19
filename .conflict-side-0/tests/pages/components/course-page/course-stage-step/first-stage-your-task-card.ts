import { clickable, collection, isVisible, text } from 'ember-cli-page-object';

export default {
  clickOnCompleteStepButton: clickable('[data-test-complete-step-button]'),
  clickOnMarkStageAsCompleteButton: clickable('[data-test-mark-stage-as-complete-button]'),
  scope: '[data-test-first-stage-your-task-card]',

  scrollIntoView() {
    return document.querySelector(this.scope)!.scrollIntoView();
  },

  steps: collection('[data-test-step-list-step]', {
    title: text('[data-test-step-title]'),
    isComplete: isVisible('[data-test-step-complete-icon]'),
  }),
};
