import { create, hasClass } from 'ember-cli-page-object';

export default create({
  scope: '[data-test-application-container]',
  hasDarkClass: hasClass('dark'),
});
