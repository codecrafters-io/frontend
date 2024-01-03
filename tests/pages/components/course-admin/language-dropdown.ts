import { clickable, clickOnText, text } from 'ember-cli-page-object';
import { settled } from '@ember/test-helpers';

export default {
  async click() {
    this.clickRaw();
    await settled();
  },

  clickOnLanguageLink(languageName: string) {
    return this.content.clickOnLanguageLink(languageName);
  },

  clickRaw: clickable('button'),

  content: {
    clickOnLanguageLink: clickOnText('[data-test-language-link]'),
    scope: '[data-test-language-dropdown-content]',
  },

  currentLanguageName: text('[data-test-current-language-name]'),
  scope: '[data-test-language-dropdown]',
};
