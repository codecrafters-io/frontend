import { clickOnText, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  clickOnBadge: clickOnText('[data-test-badge-name]'),
  visit: visitable('/badges'),
});
