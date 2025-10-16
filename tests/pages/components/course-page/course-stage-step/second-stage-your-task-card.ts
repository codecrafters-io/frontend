import { clickable, collection, isVisible, text } from 'ember-cli-page-object';

export default {
  clickOnCompleteStepButton: clickable('[data-test-complete-step-button]'),
  clickOnHideSolutionButton: clickable('[data-test-hide-solution-button]'),
  clickOnSolutionBlurredOverlay: clickable('[data-test-solution-blurred-overlay]'),
  hasFileDiffCard: isVisible('[data-test-file-diff-card]'),
  hasHideSolutionButton: isVisible('[data-test-hide-solution-button]'),
  hasRevealSolutionButton: isVisible('[data-test-reveal-solution-button]'),
  hasSolutionBlurredOverlay: isVisible('[data-test-solution-blurred-overlay]'),
  hasScreencastsLink: isVisible('[data-test-screencasts-link]'),
  scope: '[data-test-second-stage-your-task-card]',

  scrollIntoView() {
    return document.querySelector(this.scope)!.scrollIntoView();
  },

  steps: collection('[data-test-step-list-step]', {
    title: text('[data-test-step-title]'),
    isComplete: isVisible('[data-test-step-complete-icon]'),
  }),
};
