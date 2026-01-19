import { clickable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  clickOnConfigureExtensionsButton: clickable('[data-test-configure-extensions-button]'),

  scope: '[data-test-base-stages-completed-page]',
  visit: visitable('/courses/:course_slug/base-stages-completed'),
});
