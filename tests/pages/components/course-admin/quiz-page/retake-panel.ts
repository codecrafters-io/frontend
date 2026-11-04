import { clickable, isVisible, property, text } from 'ember-cli-page-object';

export default {
  allowRetakeButtonIsDisabled: property('disabled', '[data-test-allow-retake-button]'),
  allowRetakeButtonIsVisible: isVisible('[data-test-allow-retake-button]'),
  clickOnAllowRetakeButton: clickable('[data-test-allow-retake-button]'),
  clickOnUndoButton: clickable('[data-test-undo-retake-button]'),
  errorText: text('[data-test-retake-error]'),
  scope: '[data-test-retake-panel]',
  statusText: text('[data-test-retake-status]'),
  statusIsVisible: isVisible('[data-test-retake-status]'),
};
