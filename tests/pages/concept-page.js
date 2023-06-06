import { clickable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  clickOnContinueButton: clickable('[data-test-continue-button]'),

  visit: visitable('/concept/:slug'),
});
