import { attribute, clickable, collection, isPresent, text, triggerable, visitable } from 'ember-cli-page-object';
import { visit } from '@ember/test-helpers';
import createPage from 'codecrafters-frontend/tests/support/create-page';
import helpscoutBeacon from 'codecrafters-frontend/tests/pages/components/helpscout-beacon';

export default createPage({
  async clickOnConceptCard(title: string) {
    const card = [...this.conceptCards].find((card: { title: string }) => card.title === title);
    const href = card!.href;
    await visit(href);
  },

  clickOnCreateConceptButton: clickable('[data-test-create-concept-button]'),

  conceptCards: collection('[data-test-concept-card]', {
    actionText: text('[data-test-action-text]'),
    hasProgressBar: isPresent('[data-test-concept-card-progress]'),
    hasProgressDonut: isPresent('[data-test-concept-card-progress-donut]'),
    hover: triggerable('mouseenter'),
    href: attribute('href'),
    progressText: text('[data-test-concept-card-progress-text]'),
    title: text('[data-test-concept-title]'),

    draftLabel: {
      hover: triggerable('mouseenter'),
      scope: '[data-test-draft-label]',
    },
  }),

  helpscoutBeacon: helpscoutBeacon,

  visit: visitable('/concepts'),
});
