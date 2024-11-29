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
  scope: '#second-stage-tutorial-card',

  scrollIntoView() {
    return document.querySelector(this.scope)!.scrollIntoView();
  },

  steps: collection('[data-test-expandable-step-list-step]', {
    title: text('[data-test-step-title]'),
    isExpanded: isVisible('[data-test-expanded-step-content]'),
    isComplete: isVisible('[data-test-step-complete-icon]'),
    instructions: text('[data-test-expanded-step-content]'),
  }),
};
