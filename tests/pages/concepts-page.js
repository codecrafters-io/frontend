import { collection, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  clickOnConceptCard(title) {
    return this.conceptCards
      .toArray()
      .find((card) => card.title === title)
      .click();
  },

  conceptCards: collection('[data-test-concept-card]', {
    title: text('[data-test-concept-title]'),
  }),

  visit: visitable('/concepts'),
});
