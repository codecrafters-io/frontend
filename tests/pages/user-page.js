import { attribute, collection, text, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';
import CourseProgressListItem from 'codecrafters-frontend/tests/pages/components/course-progress-list-item';

export default createPage({
  avatar: {
    scope: 'img[alt="avatar"]',
    src: attribute('src'),
  },

  githubDetails: {
    scope: '[data-test-profile-github-link]',
    username: text(),
    link: attribute('href'),
  },

  adminProfileButton: {
    scope: '[data-test-admin-profile-button]',
  },

  profileDescriptionMarkdown: {
    scope: '[data-test-profile-description-markdown]',
  },

  userLabel: {
    scope: '[data-test-user-label]',
    hover: triggerable('mouseenter'),
  },

  courseProgressListItems: collection('[data-test-course-progress-list-item]', CourseProgressListItem),
  profileCustomizationNotice: { scope: '[data-test-profile-customization-notice]' },

  visit: visitable('/users/:username'),
});
