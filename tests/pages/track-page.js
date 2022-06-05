import { collection, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

import finishRender from 'codecrafters-frontend/tests/support/finish-render';

export default createPage({
  cards: collection('[data-test-track-page-card]', {
    title: text('[data-test-track-page-card-title]'),
  }),

  async clickOnCourseCard(courseName) {
    this.cards.toArray().findBy('title', courseName).click();
    await finishRender(); // Page has poller
  },

  visit: visitable('/tracks/:track_slug'),
});
