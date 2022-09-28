import { clickable, collection, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  courseIdeaCards: collection('[data-test-course-extension-idea-card]', {
    clickOnSupervoteButton: clickable('[data-test-supervote-button]'),
    clickOnVoteButton: clickable('[data-test-vote-page-button]'),
    name: text('[data-test-course-idea-name]'),
    supervoteButtonText: text('[data-test-supervote-button]'),
    supervoteButtonTooltipText: text('.ember-tooltip'),
    voteButtonText: text('[data-test-vote-page-button]'),
  }),

  findCourseIdeaCard(name) {
    return this.courseIdeaCards.toArray().find((card) => card.name === name);
  },

  visit: visitable('/vote-page'), // Should redirect to /vote-page/course-ideas
});
