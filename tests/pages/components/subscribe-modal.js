import { clickable } from 'ember-cli-page-object';

export default {
  clickOnSubscribeButton: clickable('[data-test-subscribe-button]'),
  scope: '[data-test-subscribe-modal]',
};
