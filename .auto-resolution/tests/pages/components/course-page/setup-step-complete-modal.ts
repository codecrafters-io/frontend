import { clickable } from 'ember-cli-page-object';

export default {
  clickOnNextButton: clickable('[data-test-next-button]'),
  scope: '[data-test-setup-step-complete-modal]',
};
