import { clickable, create, fillable, focusable, isVisible, triggerable } from 'ember-cli-page-object';

export default create({
  scope: '[data-test-feedback-dropdown-content]',
  clickOnSendButton: clickable('[data-test-send-button]'),
  fillInExplanation: fillable('textarea'),
  focusTextArea: focusable('textarea'),
  sendKeyToTextArea: triggerable('keydown', 'textarea'),
  sendButtonIsVisible: isVisible('[data-test-send-button]'),
  toggle: clickable('[data-test-feedback-button]:last', { resetScope: true }),
});
