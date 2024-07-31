import { clickOnText, clickable, collection, text } from 'ember-cli-page-object';
import DarkModeToggle from 'codecrafters-frontend/tests/pages/components/dark-mode-toggle';

export default {
  clickOnLink: clickOnText('div[role="button"]'),
  darkModeToggle: DarkModeToggle,

  hasLink(text) {
    return this.links.toArray().some((link) => link.text.includes(text));
  },

  links: collection('div[role="button"]', {
    text: text(),
  }),

  scope: '[data-test-account-dropdown-content]',
  toggle: clickable('[data-test-account-dropdown-trigger]', { resetScope: true }),
};
