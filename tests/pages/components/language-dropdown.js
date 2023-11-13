import { text, clickable, clickOnText, collection } from 'ember-cli-page-object';

export default {
  currentLanguageName: text('[data-test-language-dropdown-trigger] [data-test-current-language-name]', { resetScope: true }),
  toggle: clickable('[data-test-language-dropdown-trigger]', { resetScope: true }),
  clickOnLink: clickOnText('div[role="button"]'),

  hasLink(text) {
    return this.links.toArray().some((link) => link.text.includes(text));
  },

  links: collection('div[role="button"]', {
    text: text(),
  }),

  resetScope: true,
  scope: '[data-test-language-dropdown-content]',
};
