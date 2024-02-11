import { clickable, collection, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  clickOnConceptCard(title: string) {
    return this.conceptCards
      .toArray()
      .find((card: { title: string }) => card.title === title)
      .click();
  },

  clickOnCreateConceptButton: clickable('[data-test-create-concept-button]'),

  conceptCards: collection('[data-test-concept-card]', {
    title: text('[data-test-concept-title]'),

    progress: {
      scope: '[data-test-concept-card-progress]',
    }
  }),

  visit: visitable('/concepts'),
});
