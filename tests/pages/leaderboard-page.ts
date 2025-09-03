import { collection, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  description: text('[data-test-leaderboard-description]'),

  entriesTable: {
    entries: collection('[data-test-leaderboard-entry-row]'),
  },

  languageDropdown: {
    scope: '[data-test-language-dropdown]',
  },

  title: text('[data-test-leaderboard-title]'),
  visit: visitable('/leaderboards/:language_slug'),
});
