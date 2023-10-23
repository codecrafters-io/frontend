import { clickable, collection, text, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  courseExtensionIdeaCards: collection('[data-test-course-extension-idea-card]', {
    clickOnVoteButton: clickable('[data-test-vote-button]'),
    hoverOnTrackBetaLabel: triggerable('mouseenter', '[data-test-track-beta-label]'),
    name: text('[data-test-course-extension-idea-name]'),
    voteButtonText: text('[data-test-vote-button]'),
  }),

  courseIdeaCards: collection('[data-test-course-idea-card]', {
    clickOnVoteButton: clickable('[data-test-vote-button]'),
    hoverOnTrackBetaLabel: triggerable('mouseenter', '[data-test-track-beta-label]'),
    name: text('[data-test-course-idea-name]'),
    voteButtonText: text('[data-test-vote-button]'),
  }),

  findCourseExtensionIdeaCard(name) {
    return this.courseExtensionIdeaCards.toArray().find((card) => card.name === name);
  },

  findCourseIdeaCard(name) {
    return this.courseIdeaCards.toArray().find((card) => card.name === name);
  },

  selectedCourseName: text('[data-test-course-pill].bg-white'),

  visit: visitable('/vote'), // Should redirect to /vote/challenge-ideas
  visitCourseExtensionIdeasTab: visitable('/vote/challenge-extension-ideas'),
});
