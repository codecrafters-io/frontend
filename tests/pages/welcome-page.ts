import createPage from 'codecrafters-frontend/tests/support/create-page';
import { visitable } from 'ember-cli-page-object';

export default createPage({
  visit: visitable('/welcome'),
});
