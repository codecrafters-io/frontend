import { collection, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  clickOnConceptCard(title: string) {
    return this.conceptCards
      .toArray()
      .find((card: { title: string }) => card.title === title)
      .click();
  },

  conceptCards: collection('[data-test-concept-card]', {
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
