import { attribute, collection, isPresent, text, visitable } from 'ember-cli-page-object';
import { visit } from '@ember/test-helpers';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  async clickOnConceptCard(title: string) {
    const card = [...this.conceptCards].find((card: { title: string }) => card.title === title);
    const href = card!.href;
    await visit(href);
  },

  conceptCards: collection('[data-test-concept-card]', {
    hasProgressBar: isPresent('[data-test-concept-card-progress]'),
    href: attribute('href'),
    progressBarText: text('[data-test-concept-card-progress-bar]'),
    readingTime: text('[data-test-concept-card-reading-time]'),
    title: text('[data-test-concept-title]'),
  }),

  header: {
    author: {
      scope: '[data-test-concept-group-author]',
      title: text('[data-test-concept-group-author-title]'),
      username: text('[data-test-concept-group-author-username]'),
    },

    description: text('[data-test-concept-group-description]'),
    scope: '[data-test-concept-group-header]',
    title: text('[data-test-concept-group-title]'),
  },

  visit: visitable('/collections/:concept_group_slug'),
});
