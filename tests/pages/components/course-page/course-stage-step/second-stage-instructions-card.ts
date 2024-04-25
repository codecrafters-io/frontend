import { clickable, collection, isVisible, text } from 'ember-cli-page-object';

export default {
  clickOnCompleteStepButton: clickable('[data-test-complete-step-button]'),
  hasScreencastsLink: isVisible('[data-test-screencasts-link]'),

  scope: '#second-stage-instructions-card',

  scrollIntoView() {
    return document.querySelector(this.scope)!.scrollIntoView();
  },

  steps: collection('[data-test-expandable-step-list-step]', {
    title: text('[data-test-step-title]'),
    isExpanded: isVisible('[data-test-expanded-step-content]'),
    isComplete: isVisible('[data-test-step-complete-icon]'),
  }),
};
