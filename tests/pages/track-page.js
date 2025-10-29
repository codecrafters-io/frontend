import { collection, clickable, isVisible, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';

export default createPage({
  cards: collection('[data-test-track-page-card]', {
    title: text('[data-test-track-page-card-title]'),
  }),

  async clickOnCourseCard(courseName) {
    [...this.cards].findBy('title', courseName).click();
    await finishRender(); // Page has poller
  },

  clickOnResumeTrackButton: clickable('[data-test-resume-track-button]'),
  clickOnStartTrackButton: clickable('[data-test-primary-start-track-button]'),
  hasResumeTrackButton: isVisible('[data-test-resume-track-button]'),
  hasStartTrackButton: isVisible('[data-test-primary-start-track-button]'),

  header: {
    descriptionText: text('[data-test-track-header-description]'),
    scope: '[data-test-track-header]',
  },

  primerConceptGroupSection: {
    scope: '[data-test-primer-concept-group-section]',
  },

  visit: visitable('/tracks/:track_slug'),
});
