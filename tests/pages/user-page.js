import { visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  userLabel: {
    scope: '[data-test-user-label]',
  },

  visit: visitable('/users/:username'),
});
