import { clickable, clickOnText, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  anonymousModeToggle: {
    toggle: clickable('[data-test-anonymous-mode-toggle]'),
  },

  darkModeToggle: {
    clickOnOption: clickOnText('[data-test-dark-mode-toggle-option]'),
  },

  profileDescription: {
    input: {
      blur: triggerable('blur'),
      scope: '[data-test-profile-description-input]',
    },
  },

  refreshFromGitHubButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-refresh-from-github-button]',
  },

  visit: visitable('/settings/profile'),
});
