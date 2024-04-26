import { collection } from 'ember-cli-page-object';

export default {
  commandTexts: collection('[data-test-copyable-terminal-command-text]', {}),

  get commands() {
    return this.commandTexts.map((commandText) => commandText.text.trim());
  },
};
