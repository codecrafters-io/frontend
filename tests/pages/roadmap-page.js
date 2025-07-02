import { clickable, collection, text, triggerable, visitable, hasClass } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  courseExtensionIdeaCards: collection('[data-test-course-extension-idea-card]', {
    clickOnVoteButton: clickable('[data-test-vote-button]'),
    developmentStatusPillText: text('[data-test-development-status-pill]'),
    hoverOnDevelopmentStatusPill: triggerable('mouseenter', '[data-test-development-status-pill]'),
    isGreyedOut: hasClass('opacity-50'),
    name: text('[data-test-course-extension-idea-name]'),
    voteButtonText: text('[data-test-vote-count]'),
  }),

  courseIdeaCards: collection('[data-test-course-idea-card]', {
    clickOnVoteButton: clickable('[data-test-vote-button]'),
    developmentStatusPillText: text('[data-test-development-status-pill]'),
    hoverOnDevelopmentStatusPill: triggerable('mouseenter', '[data-test-development-status-pill]'),
    isGreyedOut: hasClass('opacity-50'),
    name: text('[data-test-course-idea-name]'),
    voteButtonText: text('[data-test-vote-count]'),
  }),

  findCourseExtensionIdeaCard(name) {
    return this.courseExtensionIdeaCards.toArray().find((card) => card.name === name);
  },

  findCourseIdeaCard(name) {
    return this.courseIdeaCards.toArray().find((card) => card.name === name);
  },

  selectedCourseName: text('[data-test-course-pill].bg-white'),

  visit: visitable('/roadmap'), // Should redirect to /roadmap/challenges
  visitCourseExtensionIdeasTab: visitable('/roadmap/challenge-extensions'),
});
