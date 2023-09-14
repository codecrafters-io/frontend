import { triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  adminProfileButton: {
    scope: '[data-test-admin-profile-button]',
  },

  userLabel: {
    scope: '[data-test-user-label]',
    hover: triggerable('mouseenter'),
  },

  visit: visitable('/users/:username'),
});
