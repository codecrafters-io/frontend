import { text } from 'ember-cli-page-object';

export default {
  copyableText: text('[data-test-copyable-text]'),
  scope: '[data-test-copyable-terminal-command]',
};
