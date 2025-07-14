import { clickable, collection, text, triggerable, visitable, hasClass, clickOnText } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  courseExtensionIdeaCards: collection('[data-test-course-extension-idea-card]', {
    clickOnVoteButton: clickable('[data-test-vote-button]'),
    developmentStatusPillText: text('[data-test-development-status-pill]'),
    hoverOnDevelopmentStatusPill: triggerable('mouseenter', '[data-test-development-status-pill]'),
    isGreyedOut: hasClass('opacity-50'),
    name: text('[data-test-course-extension-idea-name]'),
    voteCountText: text('[data-test-vote-count]'),
  }),

  courseIdeaCards: collection('[data-test-course-idea-card]', {
    clickOnVoteButton: clickable('[data-test-vote-button]'),
    developmentStatusPillText: text('[data-test-development-status-pill]'),
    hoverOnDevelopmentStatusPill: triggerable('mouseenter', '[data-test-development-status-pill]'),
    isGreyedOut: hasClass('opacity-50'),
    name: text('[data-test-course-idea-name]'),
    voteCountText: text('[data-test-vote-count]'),
  }),

  latestReleasesCard: {
    releaseItems: collection('[data-test-latest-release-item]', {
      timestamp: text('[data-test-latest-release-timestamp]'),
      title: text('[data-test-latest-release-title]'),
      type: text('[data-test-latest-release-type]'),
    }),
    scope: '[data-test-latest-releases-card]',
  },

  findCourseExtensionIdeaCard(name) {
    return this.courseExtensionIdeaCards.toArray().find((card) => card.name === name);
  },

  findCourseIdeaCard(name) {
    return this.courseIdeaCards.toArray().find((card) => card.name === name);
  },

  selectedCourseName: text('[data-test-course-dropdown-trigger] [data-test-current-course-name]'),

  courseDropdown: {
    scope: '[data-test-course-dropdown]',
    toggle: clickable('[data-test-course-dropdown-trigger]'),
    clickOnCourse: clickOnText('[data-test-course-link]', { resetScope: true }),
  },

  visit: visitable('/roadmap'), // Should redirect to /roadmap/challenges
  visitCourseExtensionIdeasTab: visitable('/roadmap/challenge-extensions'),
});
