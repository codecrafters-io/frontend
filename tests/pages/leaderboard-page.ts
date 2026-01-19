import { collection, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';
import LanguageDropdown from './components/language-dropdown';

export default createPage({
  description: text('[data-test-leaderboard-description]'),

  entriesTable: {
    entries: collection('[data-test-leaderboard-entry-row]', {
      username: text('[data-test-username]'),
    }),
  },

  languageDropdown: LanguageDropdown,
  title: text('[data-test-leaderboard-title]'),
  visit: visitable('/leaderboards/:language_slug'),
});
