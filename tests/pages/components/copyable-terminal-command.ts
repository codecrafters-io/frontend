import { clickOnText, text } from 'ember-cli-page-object';

export default {
  clickOnVariantButton: clickOnText('[data-test-variant-button]'),
  copyableText: text('[data-test-copyable-text]'),
  scope: '[data-test-copyable-terminal-command]',
};
