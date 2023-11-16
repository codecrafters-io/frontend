import { visitable, triggerable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  getStartedButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-get-started-button]',
  },

  visit: visitable('/refer'),
});
