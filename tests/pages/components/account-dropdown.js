import { collection, clickOnText, clickable, text } from 'ember-cli-page-object';

export default {
  toggle: clickable('[data-test-account-dropdown-trigger]', { resetScope: true }),
  clickOnLink: clickOnText('div[role="button"]'),

  hasLink(text) {
    return this.links.toArray().some((link) => link.text.includes(text));
  },

  links: collection('div[role="button"]', {
    text: text(),
  }),

  scope: '[data-test-account-dropdown-content]',
};
