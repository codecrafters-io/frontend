import { attribute, clickable, collection, isPresent, text, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';
import helpscoutBeacon from 'codecrafters-frontend/tests/pages/components/helpscout-beacon';

export default createPage({
  clickOnConceptCard(title: string) {
    return this.conceptCards
      .toArray()
      .find((card: { title: string }) => card.title === title)
      .click();
  },

  clickOnCreateConceptButton: clickable('[data-test-create-concept-button]'),

  conceptCards: collection('[data-test-concept-card]', {
    actionText: text('[data-test-action-text]'),
    hasProgressBar: isPresent('[data-test-concept-card-progress]'),
    hover: triggerable('mouseenter'),
    progressText: text('[data-test-concept-card-progress-text]'),
    progressBarStyle: attribute('style', '[data-test-concept-card-progress-bar]'),
    title: text('[data-test-concept-title]'),

    draftLabel: {
      hover: triggerable('mouseenter'),
      scope: '[data-test-draft-label]',
    },
  }),

  helpscoutBeacon: helpscoutBeacon,

  visit: visitable('/concepts'),
});
