import { clickable, isVisible } from 'ember-cli-page-object';

export default {
  clickOnNextButton: clickable('[data-test-next-button]'),
  isVisible: isVisible(),
  scope: '[data-test-setup-step-complete-modal]',
};
