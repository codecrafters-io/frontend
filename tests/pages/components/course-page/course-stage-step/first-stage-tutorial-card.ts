import { clickable, collection, isVisible, text } from 'ember-cli-page-object';

export default {
  clickOnCompleteStepButton: clickable('[data-test-complete-step-button]'),
  clickOnMarkStageAsCompleteButton: clickable('[data-test-mark-stage-as-complete-button]'),
  scope: '#first-stage-tutorial-card',

  scrollIntoView() {
    return document.querySelector(this.scope)!.scrollIntoView();
  },

  steps: collection('[data-test-expandable-step-list-step]', {
    title: text('[data-test-step-title]'),
    isExpanded: isVisible('[data-test-expanded-step-content]'),
    isComplete: isVisible('[data-test-step-complete-icon]'),
  }),
};
