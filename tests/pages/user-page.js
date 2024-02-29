import { collection, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';
import CourseProgressListItem from 'codecrafters-frontend/tests/pages/components/course-progress-list-item';

export default createPage({
  adminProfileButton: {
    scope: '[data-test-admin-profile-button]',
  },

  userLabel: {
    scope: '[data-test-user-label]',
    hover: triggerable('mouseenter'),
  },

  courseProgressListItems: collection('[data-test-course-progress-list-item]', CourseProgressListItem),

  visit: visitable('/users/:username'),
});
