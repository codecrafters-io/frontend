import { collection, clickOnText, visitable, text } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  badgeCards: collection('[data-test-badge-card]', {
    name: text('[data-test-badge-name]'),
  }),

  badgeEarnedModal: {
    badgeName: text('[data-test-badge-name]'),
    scope: '[data-test-badge-earned-modal]',
  },

  async clickOnBadge(badgeName) {
    await Array.from(this.badgeCards)
      .find((card) => card.name === badgeName)
      .click();
  },

  visit: visitable('/badges'),
});
